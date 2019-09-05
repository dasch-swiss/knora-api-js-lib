import { JsonConvert } from "json2typescript";
import { KnoraApiConfig } from "../../knora-api-config";
import { Constants } from "./Constants";
import { IHasProperty } from "./ontologies/class-definition";
import { ReadOntology } from "./ontologies/read-ontology";
import { ResourceClassDefinition } from "./ontologies/resource-class-definition";
import { ResourcePropertyDefinition } from "./ontologies/resource-property-definition";
import { StandoffClassDefinition } from "./ontologies/standoff-class-definition";
import { SystemPropertyDefinition } from "./ontologies/system-property-definition";

export namespace OntologyConversionUtils {

    /**
     * Given a Knora entity IRI, gets the ontology Iri.
     * External entity Iris are ignored.
     *
     * @param entityIri an entity Iri.
     * @param knoraApiConfig the Knora api configuration.
     * @return the ontology IRI as the only entry in an array, otherwise an empty array.
     */
    export const getOntologyIriFromEntityIri = (entityIri: string, knoraApiConfig: KnoraApiConfig): string[] => {

        const ontologyIri: string[] = [];

        let projectEntityBase = "http://" + knoraApiConfig.apiHost;
        if (knoraApiConfig.apiPort !== null) {
            projectEntityBase = projectEntityBase + ":" + knoraApiConfig.apiPort;
        }
        projectEntityBase = projectEntityBase + "/ontology/";

        // Check if the given entity Iri belongs to knora-api or a project ontology.
        // Ignore external entity Iris.
        if (entityIri.indexOf(Constants.KnoraApiV2) === 0) {
            ontologyIri.push(Constants.KnoraApiV2);
        } else if (entityIri.indexOf(projectEntityBase) === 0) {

            // split entity Iri on "#"
            const segments: string[] = entityIri.split(Constants.Delimiter);

            if (segments.length === 2) {
                // First segment identifies the project ontology the entity belongs to.
                ontologyIri.push(segments[0]);
            } else {
                console.error(`Error: ${entityIri} is not a valid Knora entity IRI.`);
            }
        }

        return ontologyIri;

    };

    /**
     * Determines resource class definitions when passed to filter() applied to an array of entity definitions.
     *
     * @param entity the entity definition to be analyzed.
     */
    export const filterResourceClassDefinitions = (entity: { [index: string]: any }): boolean => {
        return entity.hasOwnProperty(Constants.IsResourceClass) &&
            entity[Constants.IsResourceClass] === true;
    };

    /**
     * Determines standoff class definitions when passed to filter() applied to an array of entity definitions.
     *
     * @param entity the entity definition to be analyzed.
     */
    export const filterStandoffClassDefinitions = (entity: { [index: string]: any }): boolean => {
        return entity.hasOwnProperty(Constants.IsStandoffClass) &&
            entity[Constants.IsStandoffClass] === true;
    };

    /**
     * Determines resource property definitions when passed to filter() applied to an array of entity definitions.
     *
     * @param entity the entity definition to be analyzed.
     */
    export const filterResourcePropertyDefinitions = (entity: { [index: string]: any }): boolean => {
        return entity.hasOwnProperty(Constants.IsResourceProperty) &&
            entity[Constants.IsResourceProperty] === true;
    };

    /**
     * Determines system property definitions when passed to filter() applied to an array of entity definitions.
     *
     * @param entity the entity definition to be analyzed.
     */
    export const filterSystemPropertyDefintions = (entity: { [index: string]: any }) => {
        return (entity["@type"] === Constants.DataTypeProperty || entity["@type"] === Constants.ObjectProperty)
            && !entity.hasOwnProperty(Constants.IsResourceProperty);
    };

    /**
     * Converts an entity defintion to the specified type.
     *
     * @param entity the entity definition to be converted.
     * @param dataType the target type of the conversion.
     * @param jsonConvert the converter to be used.
     */
    export const convertEntity = <T>(entity: object, dataType: { new(): T }, jsonConvert: JsonConvert): T => {
        return jsonConvert.deserializeObject(entity, dataType);
    };

    /**
     * Given an array of entities, converts and adds them to the given ontology.
     *
     * @param ontology the ontology to which the definitions should be added.
     * @param entities the entities to be converted and added.
     * @param jsonConvert instance of JsonConvert to be used.
     */
    export const convertAndAddEntityDefinitions = (ontology: ReadOntology, entities: object[], jsonConvert: JsonConvert) => {

        // Convert resource classes
        entities.filter(filterResourceClassDefinitions).map(resclassJsonld => {
            return convertEntity(resclassJsonld, ResourceClassDefinition, jsonConvert);
        }).forEach((resClass: ResourceClassDefinition) => {
            ontology.classes[resClass.id] = resClass;
        });

        // Convert standoff classes
        entities.filter(filterStandoffClassDefinitions).map(standoffclassJsonld => {
            return convertEntity(standoffclassJsonld, StandoffClassDefinition, jsonConvert);
        }).forEach((standoffClass: StandoffClassDefinition) => {
            ontology.classes[standoffClass.id] = standoffClass;
        });

        // Convert resource properties (properties pointing to Knora values)
        entities.filter(filterResourcePropertyDefinitions).map(propertyJsonld => {
            return convertEntity(propertyJsonld, ResourcePropertyDefinition, jsonConvert);
        }).forEach((prop: ResourcePropertyDefinition) => {
            ontology.properties[prop.id] = prop;
        });

        // Convert system properties (properties not pointing to Knora values)
        entities.filter(filterSystemPropertyDefintions).map(propertyJsonld => {
            return convertEntity(propertyJsonld, SystemPropertyDefinition, jsonConvert);
        }).forEach((prop: SystemPropertyDefinition) => {
            ontology.properties[prop.id] = prop;
        });
    };

    /**
     * Given an ontology, analyzes its direct dependencies and adds them to the given ontology.
     *
     * @param ontology the ontology whose direct dependencies should be analyzed.
     * @param knoraApiConfig the Knora API config to be used.
     */
    export const analyzeDirectDependencies = (ontology: ReadOntology, knoraApiConfig: KnoraApiConfig) => {

        // Ontologies referenced by this ontology
        const referencedOntologies: Set<string> = new Set([]);

        // Collect ontologies referenced by this ontology in resource classes:
        // references to properties (cardinalities) and resource classes (super classes)
        for (const index in ontology.classes) {
            if (ontology.classes.hasOwnProperty(index)) {
                ontology.classes[index].propertiesList.forEach((prop: IHasProperty) => {
                    getOntologyIriFromEntityIri(prop.propertyIndex, knoraApiConfig)
                        .forEach(ontoIri => referencedOntologies.add(ontoIri));
                });
                ontology.classes[index].subClassOf.forEach((superClass: string) => {
                    getOntologyIriFromEntityIri(superClass, knoraApiConfig)
                        .forEach(ontoIri => referencedOntologies.add(ontoIri));
                });
            }
        }

        // Collect ontologies referenced by this ontology in properties:
        // references to other properties (super properties) and resource classes (subject and object types)
        for (const index in ontology.properties) {
            if (ontology.properties.hasOwnProperty(index)) {
                if (ontology.properties[index].objectType !== undefined) {
                    getOntologyIriFromEntityIri(ontology.properties[index].objectType as string, knoraApiConfig)
                        .forEach(ontoIri => referencedOntologies.add(ontoIri));
                }
                if (ontology.properties[index].subjectType !== undefined) {
                    getOntologyIriFromEntityIri(ontology.properties[index].subjectType as string, knoraApiConfig)
                        .forEach(ontoIri => referencedOntologies.add(ontoIri));
                }
                ontology.properties[index].subPropertyOf.forEach((superProperty: string) => {
                    getOntologyIriFromEntityIri(superProperty, knoraApiConfig)
                        .forEach(ontoIri => referencedOntologies.add(ontoIri));
                });
            }
        }

        // Remove this ontology from the collection
        referencedOntologies.delete(ontology.id);

        ontology.dependsOnOntologies = referencedOntologies;

    };

}
