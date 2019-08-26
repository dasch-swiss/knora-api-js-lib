import {Endpoint} from '../../endpoint';
import {ApiResponseError, OntologyCache} from '../../..';
import {ReadResource} from '../../../models/v2/resources/read-resource';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {AjaxResponse} from 'rxjs/ajax';
import {Observable} from 'rxjs';
import {ReadOntology} from '../../../models/v2/ontologies/read-ontology';

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require('jsonld/dist/jsonld.js');

export class ResourcesEndpoint extends Endpoint {

    getResource(resourceIri: string, ontologyCache?: OntologyCache): Observable<ReadResource | ApiResponseError> {
        // TODO: Do not hard-code the UR and http call params, generate this from Knora
        return this.httpGet('/resources/' + encodeURIComponent(resourceIri)).pipe(
                mergeMap((ajaxResponse: AjaxResponse) => {
                    // console.log(JSON.stringify(ajaxResponse.response));
                    // TODO: @rosenth Adapt context object
                    // TODO: adapt getOntologyIriFromEntityIri
                    return jsonld.compact(ajaxResponse.response, {});
                }), map((jsonldobj: object) => {
                    // console.log(JSON.stringify(jsonldobj));
                    return this.parseResourceSequence(jsonldobj, ontologyCache);
                }),
                catchError(error => {
                    console.error(error);
                    return this.handleError(error);
                })
        );
    }

    private parseResourceSequence(resourcesJsonld: object, ontologyCache?: OntologyCache): ReadResource[] {

        if (resourcesJsonld.hasOwnProperty('@graph')) {
            // sequence of resources
            return (resourcesJsonld as { [index: string]: object[] })['graph']
                    .map((res: {[index: string]: object[] | string}) => this.parseResource(res, ontologyCache));
        } else {
            //  one or no resource
            if (Object.keys(resourcesJsonld).length === 0) {
                return [];
            } else {
                return [this.parseResource(resourcesJsonld as { [index: string]: object[] | string }, ontologyCache)];
            }
        }
    }

    private parseResource(resourceJsonld: { [index: string]: string | object[] }, ontologyCache?: OntologyCache): ReadResource {

        // determine resource class
        const resourceType = resourceJsonld['@type'] as string;

        console.log(resourceType);

        return new ReadResource();

    }

}
