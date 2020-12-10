import { JsonObject, JsonProperty } from "json2typescript";
import { Constants } from "../Constants";

 /** 
  * @category Model V2 
  */ 
@JsonObject("UpdateProjectMetadataResponse")
export class UpdateProjectMetadataResponse {

    @JsonProperty(Constants.KnoraApiV2 + Constants.Delimiter + "result", String)
    result: string = "";
}
