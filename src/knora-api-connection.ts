import { AdminEndpoint } from "./api/admin-endpoint";
import { KnoraApiConfig } from "./knora-api-config";
import { V2Endpoint } from "./api/v2-endpoint";

/**
 * Offers methods for JavaScript developers to interact with the Knora API.
 */
export class KnoraApiConnection {

    ///////////////
    // CONSTANTS //
    ///////////////

    // <editor-fold desc="">
    // </editor-fold>

    ////////////////
    // PROPERTIES //
    ////////////////

    // <editor-fold desc="">

    /**
     * Holds all endpoints of the admin route
     */
    public readonly admin: AdminEndpoint;

    /**
     * Holds all endpoints of the v2 route
     */
    public readonly v2: V2Endpoint;

    // </editor-fold>

    /////////////////
    // CONSTRUCTOR //
    /////////////////

    // <editor-fold desc="">

    /**
     * Constructor.
     * Sets up all endpoints for the Knora API.
     * @param knoraApiConfig
     */
    constructor(knoraApiConfig: KnoraApiConfig) {

        // Instantiate the endpoints
        this.admin = new AdminEndpoint(knoraApiConfig, "/admin");
        this.v2 = new V2Endpoint(knoraApiConfig, "/v2");
        // todo more

    }

    // </editor-fold>

    /////////////
    // METHODS //
    /////////////

    // <editor-fold desc="">
    // </editor-fold>

}