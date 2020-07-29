import { JsonObject, JsonProperty } from "json2typescript";
import { StringLiteral } from "../../../admin/string-literal";
import { Constants } from "../../Constants";
import { DateTimeStampConverter } from "../../custom-converters/date-time-stamp-converter";
import { SubClassOfConverter } from "../../custom-converters/subclass-of-converter";
import { UpdateOntology } from "../update-ontology";
import { StringLiteralJsonLd } from "../../string-literal-json-ld";
import { IdConverter } from "../../custom-converters/id-converter";

@JsonObject("ResourceClassProperty") 
export class ResourceClassProperty {

    @JsonProperty("@type", String)
    type: string = "";

    @JsonProperty("cardinality", String)
    cardinality: string = "";

    @JsonProperty(Constants.OnProperty, IdConverter)
    onProperty: string = "";

    @JsonProperty(Constants.GuiOrder, Number)
    guiOrder: number = 0;
   
}

// Resource class data to send to the method creataResourceClass
@JsonObject("CreateResourceClass")
export class CreateResourceClass {

    @JsonProperty("ontology", UpdateOntology)
    ontology: UpdateOntology = new UpdateOntology();

    @JsonProperty("name", String)
    name: string = "";

    @JsonProperty("labels", [StringLiteral])
    labels: StringLiteral[] = [];

    @JsonProperty("comments", [StringLiteral], true)
    comments: StringLiteral[] = [];

    @JsonProperty("subClassOf", [String])
    subClassOf: string[] = [];

    @JsonProperty("properties", [ResourceClassProperty])
    properties: ResourceClassProperty[] = [];
}

// Resource class data as part of CreateResourceClassPayload
@JsonObject("ResourceClass")
export class ResourceClass {
    @JsonProperty("@id", String)
    id: string = "";

    @JsonProperty("@type", String, true)
    type: string = Constants.Class;

    @JsonProperty(Constants.Label, [StringLiteralJsonLd])
    label: StringLiteralJsonLd[] = [];

    @JsonProperty(Constants.Comment, [StringLiteralJsonLd])
    comment: StringLiteralJsonLd[] = [];

    @JsonProperty(Constants.SubClassOf, SubClassOfConverter)
    subClassOf: string[] = [];

    // @JsonProperty(Constants.Cardinality)
}


// Resource class data payload: This will be sent to the api
@JsonObject("CreateResourceClassPayload")
export class CreateResourceClassPayload {

    /**
     * Ontology iri
     */
    @JsonProperty("@id", String)
    id: string = "";

    @JsonProperty("@type", String, true)
    type: string = Constants.Ontology;

    @JsonProperty(Constants.LastModificationDate, DateTimeStampConverter, true)
    lastModificationDate: string;

    @JsonProperty("@graph", [ResourceClass])
    resClass: ResourceClass[] = [];
}

