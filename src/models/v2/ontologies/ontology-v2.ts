import {PropertyDefinition} from './property-definition';
import {ClassDefinition, IHasProperty, ResourceClass, StandoffClass} from './class-definition';

export class OntologyV2 {
    lastModificationDate: string;
    properties: {[index: string]: PropertyDefinition} = {};
    classes: {[index: string]: ClassDefinition} = {};

    dependsOnOntologies: Set<string>;

    constructor(readonly id: string) { }
}
