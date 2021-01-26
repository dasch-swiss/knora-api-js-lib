import { JsonConvert, JsonConverter, JsonCustomConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { PropertyMatchingRule } from "json2typescript/src/json2typescript/json-convert-enums";
import { Constants } from "../Constants";
import { Dataset } from "../project-metadata/dataset";
import { Person } from "../project-metadata/person";

/**
 * @category Internal
 */
@JsonConverter
export class MetadataConverter implements JsonCustomConvert<[Dataset | Person]> {

    static jsonConvert: JsonConvert = new JsonConvert(
        OperationMode.ENABLE,
        ValueCheckingMode.DISALLOW_NULL,
        false,
        PropertyMatchingRule.CASE_STRICT
    );

    serializeElement(el: Dataset | Person): any {
        if (el.hasOwnProperty("type") && el["type"] === Constants.DspDataset) {
            return MetadataConverter.jsonConvert.serializeObject(el, Dataset);
        } else if (el.hasOwnProperty("type") && el["type"] === Constants.DspPerson) {
            return MetadataConverter.jsonConvert.serializeObject(el, Person);
        } else {
            throw new Error("Expected Dataset or Person object type.");
        }
    }

    deserializeElement(el: any): Dataset | Person {
        if (el.hasOwnProperty("@type") && el["@type"] === Constants.DspDataset) {
            return MetadataConverter.jsonConvert.deserializeObject(el, Dataset);
        } else if (el.hasOwnProperty("@type") && el["@type"] === Constants.DspPerson) {
            return MetadataConverter.jsonConvert.deserializeObject(el, Person);
        } else {
            throw new Error(`Expected ${Constants.DspDataset} or ${Constants.DspPerson} object type.`);
        }
    }

    serialize(el: [Dataset | Person]): any {
        const newObj = [] as any[];
        el.forEach((
            (item: Dataset | Person) => newObj.push(this.serializeElement(item))
        ));
        return newObj;
    }

    deserialize(el: any): [Dataset | Person] {
        const newObj = [] as any[];
        el.forEach((
            (item: any) => newObj.push(this.deserializeElement(item))
        ));
        return newObj as [Dataset | Person];
    }
}
