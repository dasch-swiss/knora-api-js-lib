import { JsonObject, JsonProperty } from "json2typescript";
import { Constants } from "../Constants";
import { IUrl } from "../custom-converters/base-url-converter";
import { IId } from "../custom-converters/union-data-management-plan-id-converter";
import { UnionPersonOrganizationIdConverter } from "../custom-converters/union-person-organization-id-converter";
import { UrlToUrlObjectConverter } from "../custom-converters/url-to-url-object-converter";
import { BaseProjectMetadata } from "./base-project-metadata";
import { Organization } from "./organization";
import { Person } from "./person";

/** 
 * @category Model V2 
 */ 
@JsonObject("Grant")
export class Grant extends BaseProjectMetadata {

    @JsonProperty("@id", String)
    id: string = "";

    @JsonProperty(Constants.DspHasFunder, UnionPersonOrganizationIdConverter)
    funder: Person[] | Organization[] | IId[] = [];

    @JsonProperty(Constants.DspHasName, String, true)
    name?: string = undefined;

    @JsonProperty(Constants.DspHasNumber, String, true)
    number?: string = undefined;

    @JsonProperty(Constants.DspHasURL, UrlToUrlObjectConverter, true)
    url?: IUrl = undefined;

    constructor() {
        super(Constants.DspGrant);
    }
}
