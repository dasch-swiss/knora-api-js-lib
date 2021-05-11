import { Component, OnInit } from '@angular/core';
import {
    ApiResponseData,
    ApiResponseError,
    Constants,
    CountQueryResponse,
    CreateBooleanValue,
    CreateIntValue,
    CreateOntology,
    CreateResource,
    CreateResourceClass,
    CreateValue,
    DeleteOntologyResponse,
    DeleteResource,
    DeleteResourceResponse,
    DeleteValue,
    DeleteValueResponse,
    KnoraApiConfig,
    KnoraApiConnection,
    ListNodeV2,
    LoginResponse,
    OntologiesMetadata,
    OntologyMetadata,
    ReadOntology,
    ReadResource,
    ReadResourceSequence,
    ResourceClassDefinitionWithAllLanguages,
    UpdateIntValue,
    UpdateOntology,
    UpdateResource,
    UpdateResourceMetadata,
    UpdateResourceMetadataResponse,
    UpdateValue,
    UserCache,
    UserResponse,
    UsersResponse,
    WriteValueResponse,
    Cardinality,
    DeleteOntology,
    DeleteResourceClass,
    DeleteResourceProperty,
    UpdateResourceClassCardinality,
    CreatePermission,
    UpdatePermission,
    CreateAdministrativePermission,
    ResourcePropertyDefinitionWithAllLanguages,
    CreateResourceProperty,
    CreateDefaultObjectAccessPermission,
    AdministrativePermissionResponse,
    DefaultObjectAccessPermissionsResponse,
    DefaultObjectAccessPermissionResponse,
    ProjectPermissionsResponse,
    AdministrativePermissionsResponse,
    UpdateChildNodeNameRequest,
    ChildNodeInfoResponse,
    StringLiteral,
    UpdateChildNodeLabelsRequest,
    UpdateChildNodeCommentsRequest,
    ProjectsMetadata,
    Dataset,
    SingleProject,
    UpdateProjectMetadataResponse,
    IUrl,
    Grant,
    Organization,
    DataManagementPlan,
    UpdateChildNodeRequest,
    ListNodeInfoResponse,
    CreateListRequest,
    ListResponse,
    UpdateResourceClassLabel,
    UpdateResourceClassComment,
    UpdateResourcePropertyLabel,
    UpdateResourcePropertyComment,
    DeletePermissionResponse,
    DeleteListResponse,
    DeleteListNodeResponse,
    UpdateAdministrativePermission,
    UpdateDefaultObjectAccessPermission,
    UpdateAdministrativePermissionGroup,
    UpdateDefaultObjectAccessPermissionGroup,
    UpdateDefaultObjectAccessPermissionResourceClass,
    UpdateDefaultObjectAccessPermissionProperty,
    RepositionChildNodeRequest,
    RepositionChildNodeResponse,
    CreateChildNodeRequest,
    UpdateOntologyMetadata
} from '@dasch-swiss/dsp-js';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    knoraApiConnection: KnoraApiConnection;

    userCache: UserCache;

    healthState: Observable<any>;

    ontologies: Map<string, ReadOntology>;
    ontologyWithAllLangs: ReadOntology;
    anythingOntologies: OntologiesMetadata;
    dokubibOntologies: OntologiesMetadata;
    ontologyMeta: OntologyMetadata;
    ontology: ReadOntology;
    resClass: ResourceClassDefinitionWithAllLanguages;
    property: ResourcePropertyDefinitionWithAllLanguages;
    addCard: ResourceClassDefinitionWithAllLanguages;
    replacedCard: ResourceClassDefinitionWithAllLanguages;
    permissionStatus: string;
    permissionUpdateStatus: string;
    permissionIri: string;
    permissionDeleted: boolean;

    // reusable response message
    message: string;

    resource: ReadResource;

    listNode: ListNodeV2;

    searchResult: ReadResource[];
    size: number;

    loginStatus = '';

    valueStatus = '';

    resourceStatus = '';

    itemPluralMapping = {
        ontology: {
            '=1': '1 ontology',
            other: '# ontologies'
        }
    };

    projectMetaStatus = '';

    listName = '';
    listLabels = '';
    listComments = '';
    listChildren = 0;
    listChildName = '';
    listChildLabels = '';
    listChildComments = '';
    listNodeId = '';
    listNodeDeleted = false;
    listNodePosition = 0;
    listNodeParentIri = '';

    ngOnInit() {
        const config = new KnoraApiConfig('http', '0.0.0.0', 3333, undefined, undefined, true);
        this.knoraApiConnection = new KnoraApiConnection(config);
        // console.log(this.knoraApiConnection);
        this.userCache = new UserCache(this.knoraApiConnection);

        this.getHealthStatus();

    }

    getHealthStatus() {
        this.healthState =
            this.knoraApiConnection.system.healthEndpoint.getHealthStatus().pipe(
                tap(
                    res => console.log(res)
                ),
                map(
                    res => {
                        if (res instanceof ApiResponseData) {
                            return res.body;
                        } else {
                            return res;
                        }
                    }
                )
            );

    }

    login() {

        this.knoraApiConnection.v2.auth.login('username', 'root', 'test').subscribe(
            (loginResponse: ApiResponseData<LoginResponse>) => {
                console.log(loginResponse);
                this.loginStatus = 'logged in';

            },
            error => console.error(error)
        );

    }

    logout() {

        this.knoraApiConnection.v2.auth.logout().subscribe(
            logoutRes => {
                console.log(logoutRes);
                this.loginStatus = 'logged out';
            },
            error => console.error(error)
        );

    }

    getUsers() {

        this.knoraApiConnection.admin.usersEndpoint.getUsers().subscribe(
            (a: ApiResponseData<UsersResponse>) => console.log(a.body.users),
            b => console.error(b)
        );

    }

    getUser(iri: string) {
        this.userCache.getUser(iri).subscribe(
            (a: UserResponse) => console.log(a.user),
            b => console.error(b)
        );
    }

    getPermissions() {

        this.knoraApiConnection.admin.permissionsEndpoint.getProjectPermissions('http://rdfh.ch/projects/0001').subscribe(
            (response: ApiResponseData<ProjectPermissionsResponse>) => {
                this.permissionStatus = 'getPermissions ok';
                console.log(response);
            },
            err => console.error('Error:', err)
        );
    }

    getAdministrativePermission() {

        this.knoraApiConnection.admin.permissionsEndpoint.getAdministrativePermission('http://rdfh.ch/projects/0001', 'http://www.knora.org/ontology/knora-admin#ProjectMember').subscribe(
            (response: ApiResponseData<AdministrativePermissionResponse>) => {
                this.permissionStatus = 'getAdministrativePermission ok';
                this.permissionIri = response.body.administrative_permission.id;
                console.log(response);
            },
            err => console.error('Error:', err)
        );

    }

    getAdministrativePermissions() {

        this.knoraApiConnection.admin.permissionsEndpoint.getAdministrativePermissions('http://rdfh.ch/projects/0001').subscribe(
            (response: ApiResponseData<AdministrativePermissionsResponse>) => {
                this.permissionStatus = 'getAdministrativePermissions ok';
                console.log(response);
            },
            err => console.error('Error:', err)
        );

    }

    createAdministrativePermission() {

        const permission = new CreatePermission();
        permission.name = 'ProjectAdminGroupAllPermission';
        permission.additionalInformation = null;
        permission.permissionCode = null;

        const permission2 = new CreatePermission();
        permission2.name = 'ProjectAdminAllPermission';
        permission2.additionalInformation = null;
        permission2.permissionCode = null;

        const groupIri = 'http://rdfh.ch/groups/0001/thing-searcher';
        const projectIri = 'http://rdfh.ch/projects/0001';

        const adminPermission = new CreateAdministrativePermission();
        adminPermission.forGroup = groupIri;
        adminPermission.forProject = projectIri;

        adminPermission.hasPermissions = [permission, permission2];

        this.knoraApiConnection.admin.permissionsEndpoint.createAdministrativePermission(adminPermission).subscribe(
            (res: ApiResponseData<AdministrativePermissionResponse>) => {
                this.permissionStatus = "createAdministrativePermission ok";
                this.permissionIri = res.body.administrative_permission.id;
                console.log(res);
            },
            err => console.error(err)
        );

    }

    updateAdministrativePermissionGroup() {
        const updateAdminPermGroup = new UpdateAdministrativePermissionGroup();

        updateAdminPermGroup.forGroup = "http://rdfh.ch/groups/00FF/images-reviewer";

        this.knoraApiConnection.admin.permissionsEndpoint.updateAdministrativePermissionGroup(this.permissionIri, updateAdminPermGroup).subscribe(
            (res: ApiResponseData<AdministrativePermissionResponse>) => {
                this.permissionUpdateStatus = "updateAdministrativePermissionGroup ok";
                console.log(res);
            },
            err => console.error(err)
        );
    }

    updateAdministrativePermission() {

        const perm = new UpdatePermission();
        perm.additionalInformation = null;
        perm.name = "ProjectAdminGroupAllPermission";
        perm.permissionCode = null;

        const updateAdminPerm = new UpdateAdministrativePermission();

        updateAdminPerm.hasPermissions = [perm];

        this.knoraApiConnection.admin.permissionsEndpoint.updateAdministrativePermission(this.permissionIri, updateAdminPerm).subscribe(
            (res: ApiResponseData<AdministrativePermissionResponse>) => {
                this.permissionUpdateStatus = "updateAdministrativePermission ok";
                console.log(res);
            },
            err => console.error(err)
        );

    }

    deletePermission() {

        this.knoraApiConnection.admin.permissionsEndpoint.deletePermission(this.permissionIri).subscribe(
            (res: ApiResponseData<DeletePermissionResponse>) => {
                this.permissionDeleted = res.body.deleted;
                console.log(res);
            },
            err => console.error(err)
        );

    }

    getDefaultObjectAccessPermissions() {

        const projectIri = 'http://rdfh.ch/projects/0001';

        this.knoraApiConnection.admin.permissionsEndpoint.getDefaultObjectAccessPermissions(projectIri).subscribe(
            (res: ApiResponseData<DefaultObjectAccessPermissionsResponse>) => {
                this.permissionStatus = "getDefaultObjectAccessPermissions ok";
                this.permissionIri = res.body.defaultObjectAccessPermissions[0].id;
                console.log(res);
            },
            err => console.error('Error:', err)
        );
    }

    createDefaultObjectAccessPermission() {

        const permission = new CreatePermission();
        permission.name = 'D';
        permission.permissionCode = 7;
        permission.additionalInformation = 'http://www.knora.org/ontology/knora-admin#ProjectMember';

        const permission2 = new CreatePermission();
        permission2.name = 'D';
        permission2.permissionCode = 7;
        permission2.additionalInformation = 'http://www.knora.org/ontology/knora-admin#KnownUser';

        const groupIri = 'http://rdfh.ch/groups/0001/thing-searcher';
        const projectIri = 'http://rdfh.ch/projects/0001';

        const adminPermission = new CreateDefaultObjectAccessPermission();
        adminPermission.forGroup = groupIri;
        adminPermission.forProject = projectIri;

        adminPermission.hasPermissions = [permission, permission2];

        this.knoraApiConnection.admin.permissionsEndpoint.createDefaultObjectAccessPermission(adminPermission).subscribe(
            (res: ApiResponseData<DefaultObjectAccessPermissionResponse>) => {
                this.permissionStatus = 'createDefaultObjectAccessPermission ok';
                console.log(res);
            },
            err => console.error('Error:', err)
        );

    }

    updateDefaultObjectAccessPermission() {

        const perm = new UpdatePermission();
        perm.additionalInformation = "http://www.knora.org/ontology/knora-admin#ProjectMember";
        perm.name = "D";
        perm.permissionCode = 7;

        const updateDefaultObjectAccessPerm = new UpdateDefaultObjectAccessPermission();

        updateDefaultObjectAccessPerm.hasPermissions = [perm];

        this.knoraApiConnection.admin.permissionsEndpoint.updateDefaultObjectAccessPermission(this.permissionIri, updateDefaultObjectAccessPerm).subscribe(
            (res: ApiResponseData<DefaultObjectAccessPermissionResponse>) => {
                this.permissionUpdateStatus = "updateDefaultObjectAccessPermission ok";
                console.log(res);
            },
            err => console.error(err)
        );

    }

    updateDefaultObjectAccessPermissionGroup() {
        const updateAdminPermGroup = new UpdateDefaultObjectAccessPermissionGroup();

        updateAdminPermGroup.forGroup = "http://rdfh.ch/groups/00FF/images-reviewer";

        this.knoraApiConnection.admin.permissionsEndpoint.updateDefaultObjectAccessPermissionGroup(this.permissionIri, updateAdminPermGroup).subscribe(
            (res: ApiResponseData<DefaultObjectAccessPermissionResponse>) => {
                this.permissionUpdateStatus = "updateDefaultObjectAccessPermissionGroup ok";
                console.log(res);
            },
            err => console.error(err)
        );
    }

    updateDefaultObjectAccessPermissionResourceClass() {
        const defaultObjectAccessPermissionResourceClass = new UpdateDefaultObjectAccessPermissionResourceClass();

        defaultObjectAccessPermissionResourceClass.forResourceClass = "http://www.knora.org/ontology/0803/incunabula#book";

        this.knoraApiConnection.admin.permissionsEndpoint.updateDefaultObjectAccessPermissionResourceClass(this.permissionIri, defaultObjectAccessPermissionResourceClass).subscribe(
            (res: ApiResponseData<DefaultObjectAccessPermissionResponse>) => {
                this.permissionUpdateStatus = "updateDefaultObjectAccessPermissionResourceClass ok";
                console.log(res);
            },
            err => console.error(err)
        );
    }

    updateDefaultObjectAccessPermissionProperty() {
        const defaultObjectAccessPermissionProperty = new UpdateDefaultObjectAccessPermissionProperty();

        defaultObjectAccessPermissionProperty.forProperty = "http://www.knora.org/ontology/00FF/images#titel";

        this.knoraApiConnection.admin.permissionsEndpoint.updateDefaultObjectAccessPermissionProperty(this.permissionIri, defaultObjectAccessPermissionProperty).subscribe(
            (res: ApiResponseData<DefaultObjectAccessPermissionResponse>) => {
                this.permissionUpdateStatus = "updateDefaultObjectAccessPermissionProperty ok";
                console.log(res);
            },
            err => console.error(err)
        );
    }

    getOntology(iri: string) {

        this.knoraApiConnection.v2.ontologyCache.getOntology(iri).subscribe(
            onto => {
                console.log('onto ', onto);
                this.ontologies = onto;
            }
        );
    }

    getOntologyWithAllLanguages(iri: string) {

        this.knoraApiConnection.v2.onto.getOntology(iri, true).subscribe(
            (onto: ReadOntology) => {
                console.log(onto);
                this.ontologyWithAllLangs = onto;
            },
            err => console.error(err)
        );
    }

    getAnythingOntologies() {
        this.knoraApiConnection.v2.onto.getOntologiesByProjectIri('http://rdfh.ch/projects/0001').subscribe(
            (response: OntologiesMetadata) => {
                console.log('anythingOntologies ', response);
                this.anythingOntologies = response;
            },
            (error: ApiResponseError) => {
                console.error('project ontologies error', error);
            }
        );
    }
    getDokubibOntologies() {
        this.knoraApiConnection.v2.onto.getOntologiesByProjectIri('http://rdfh.ch/projects/0804').subscribe(
            (response: OntologiesMetadata) => {
                console.log('dokubibOntologies ', response);
                this.dokubibOntologies = response;
            },
            (error: ApiResponseError) => {
                console.error('project ontologies error', error);
            }
        );
    }

    createOntology() {
        const createOntology = new CreateOntology();
        createOntology.label = 'Test Ontology';
        createOntology.name = 'testonto';
        createOntology.attachedToProject = 'http://rdfh.ch/projects/0001';
        this.knoraApiConnection.v2.onto.createOntology(createOntology).subscribe(
            (onto: OntologyMetadata) => {
                this.ontologyMeta = onto;
                console.log('new ontology created', onto);
            }
        );
    }

    getTestOnto(iri: string) {
        this.knoraApiConnection.v2.onto.getOntology(iri).subscribe(
            (onto: ReadOntology) => {
                this.ontology = onto;
                console.log('get testonto ', onto);
            }
        );
    }

    updateOntologyLabel() {
        const updateOntologyMetadata = new UpdateOntologyMetadata();
        updateOntologyMetadata.id = this.ontology.id;
        updateOntologyMetadata.lastModificationDate = this.ontology.lastModificationDate;
        updateOntologyMetadata.label = 'Test Onto';

        this.knoraApiConnection.v2.onto.updateOntology(updateOntologyMetadata).subscribe(
            (onto: OntologyMetadata) => {
                this.ontologyMeta = onto;
            }
        );
    }

    updateOntologyComment() {
        const updateOntologyMetadata = new UpdateOntologyMetadata();
        updateOntologyMetadata.id = this.ontology.id;
        updateOntologyMetadata.lastModificationDate = this.ontology.lastModificationDate;
        updateOntologyMetadata.comment = 'Ontology comment updated';

        this.knoraApiConnection.v2.onto.updateOntology(updateOntologyMetadata).subscribe(
            (onto: OntologyMetadata) => {
                this.ontologyMeta = onto;
            }
        );
    }

    removeOntologyComment() {
        const updateOntologyMetadata = new UpdateOntologyMetadata();
        updateOntologyMetadata.id = this.ontology.id;
        updateOntologyMetadata.lastModificationDate = this.ontology.lastModificationDate;
        updateOntologyMetadata.comment = '';

        this.knoraApiConnection.v2.onto.updateOntology(updateOntologyMetadata).subscribe(
            (onto: OntologyMetadata) => {
                this.ontologyMeta = onto;
            }
        );
    }

    updateOntologyLabelAndComment() {
        const updateOntologyMetadata = new UpdateOntologyMetadata();
        updateOntologyMetadata.id = this.ontology.id;
        updateOntologyMetadata.lastModificationDate = this.ontology.lastModificationDate;
        updateOntologyMetadata.label = 'Test Onto New Label';
        updateOntologyMetadata.comment = 'Test Onto New Comment';

        this.knoraApiConnection.v2.onto.updateOntology(updateOntologyMetadata).subscribe(
            (onto: OntologyMetadata) => {
                this.ontologyMeta = onto;
            }
        );
    }

    deleteOntology() {
        const deleteOntology = new DeleteOntology();
        deleteOntology.id = this.ontology.id;
        deleteOntology.lastModificationDate = this.ontology.lastModificationDate;

        this.knoraApiConnection.v2.onto.deleteOntology(deleteOntology).subscribe(
            (response: DeleteOntologyResponse) => {
                this.message = response.result;
                console.log('ontology deleted', response);
            }
        );
    }

    createResourceClass() {

        const onto = new UpdateOntology<CreateResourceClass>();

        onto.id = this.ontology.id;
        onto.lastModificationDate = this.ontology.lastModificationDate;

        const newResClass = new CreateResourceClass();

        newResClass.name = 'testclass';
        newResClass.label = [
            {
                language: 'de',
                value: 'Test Klasse'
            }, {
                language: 'en',
                value: 'Test Class'
            }
        ];
        newResClass.comment = [
            {
                language: 'en',
                value: 'Just an example of a new resource class'
            }
        ];
        newResClass.subClassOf = [Constants.Resource];

        onto.entity = newResClass;

        this.knoraApiConnection.v2.onto.createResourceClass(onto).subscribe(
            (response: ResourceClassDefinitionWithAllLanguages) => {
                console.log('new resource class created', response);
                this.resClass = response;
            }
        );
    }

    updateResourceClassLabel() {

        const onto = new UpdateOntology<UpdateResourceClassLabel>();

        onto.id = this.ontology.id;
        onto.lastModificationDate = this.ontology.lastModificationDate;

        const updateLabel = new UpdateResourceClassLabel();

        updateLabel.id = 'http://0.0.0.0:3333/ontology/0001/testonto/v2#testclass';

        updateLabel.labels = [
            {
                language: 'de',
                value: 'Test Klasse neu'
            }, {
                language: 'en',
                value: 'Test Class new'
            }
        ];

        onto.entity = updateLabel;

        this.knoraApiConnection.v2.onto.updateResourceClass(onto).subscribe(
            (res: ResourceClassDefinitionWithAllLanguages) => {
                this.resClass = res;
            }
        );

    }

    updateResourceClassComment() {

        const onto = new UpdateOntology<UpdateResourceClassComment>();

        onto.id = this.ontology.id;
        onto.lastModificationDate = this.ontology.lastModificationDate;

        const updateLabel = new UpdateResourceClassComment();

        updateLabel.id = 'http://0.0.0.0:3333/ontology/0001/testonto/v2#testclass';

        updateLabel.comments = [
            {
                language: 'de',
                value: 'Just an example of a new resource class new'
            }
        ];

        onto.entity = updateLabel;

        this.knoraApiConnection.v2.onto.updateResourceClass(onto).subscribe(
            (res: ResourceClassDefinitionWithAllLanguages) => {
                this.resClass = res;
            }
        );

    }

    deleteResourceClass() {

        const deleteResClass: DeleteResourceClass = new DeleteResourceClass();
        deleteResClass.id = 'http://0.0.0.0:3333/ontology/0001/testonto/v2#testclass';
        deleteResClass.lastModificationDate = this.ontology.lastModificationDate;

        this.knoraApiConnection.v2.onto.deleteResourceClass(deleteResClass).subscribe(
            (response: OntologyMetadata) => {
                this.message = 'res class has been deleted';
                console.log('res class deleted', response);
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        );

    }


    createResourceProperty() {
        const onto = new UpdateOntology<CreateResourceProperty>();

        onto.id = this.ontology.id;
        onto.lastModificationDate = this.ontology.lastModificationDate;

        const newResProp = new CreateResourceProperty();

        newResProp.name = 'hasName';

        newResProp.label = [
            {
                language: 'en',
                value: 'has name'
            },
            {
                language: 'de',
                value: 'hat Namen'
            }
        ];

        newResProp.comment = [
            {
                language: 'en',
                value: 'The name of a Thing'
            },
            {
                language: 'de',
                value: 'Der Name eines Dinges'
            }
        ];

        newResProp.subPropertyOf = [Constants.HasValue, 'http://schema.org/name'];

        newResProp.objectType = Constants.TextValue;
        // newResProp.subjectType = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';

        newResProp.guiElement = 'http://api.knora.org/ontology/salsah-gui/v2#SimpleText';
        newResProp.guiAttributes = ['size=80', 'maxlength=100'];

        onto.entity = newResProp;

        this.knoraApiConnection.v2.onto.createResourceProperty(onto).subscribe(
            (response: ResourcePropertyDefinitionWithAllLanguages) => {
                this.property = response;
                console.log('new resource property created', response);
            }
        );
    }

    updateResourcePropertyLabel() {

        const onto = new UpdateOntology<UpdateResourcePropertyLabel>();

        onto.id = this.ontology.id;
        onto.lastModificationDate = this.ontology.lastModificationDate;

        const updateLabel = new UpdateResourcePropertyLabel();

        updateLabel.id = 'http://0.0.0.0:3333/ontology/0001/testonto/v2#hasName';

        updateLabel.labels = [
            {
                language: 'en',
                value: 'has name new'
            },
            {
                language: 'de',
                value: 'hat Namen neu'
            }
        ];

        onto.entity = updateLabel;

        this.knoraApiConnection.v2.onto.updateResourceProperty(onto).subscribe(
            (res: ResourcePropertyDefinitionWithAllLanguages) => {
                this.property = res;
            }
        );

    }

    updateResourcePropertyComment() {

        const onto = new UpdateOntology<UpdateResourcePropertyComment>();

        onto.id = this.ontology.id;
        onto.lastModificationDate = this.ontology.lastModificationDate;

        const updateLabel = new UpdateResourcePropertyComment();

        updateLabel.id = 'http://0.0.0.0:3333/ontology/0001/testonto/v2#hasName';

        updateLabel.comments = [
            {
                language: 'en',
                value: 'The name of a Thing new'
            },
            {
                language: 'de',
                value: 'Der Name eines Dinges neu'
            }
        ];

        onto.entity = updateLabel;

        this.knoraApiConnection.v2.onto.updateResourceProperty(onto).subscribe(
            (res: ResourcePropertyDefinitionWithAllLanguages) => {
                this.property = res;
            }
        );

    }

    deleteResourceProperty() {

        const deleteResProp: DeleteResourceProperty = new DeleteResourceProperty();
        deleteResProp.id = 'http://0.0.0.0:3333/ontology/0001/testonto/v2#hasName';
        deleteResProp.lastModificationDate = this.ontology.lastModificationDate;

        this.knoraApiConnection.v2.onto.deleteResourceProperty(deleteResProp).subscribe(
            (response: OntologyMetadata) => {
                this.message = 'res property has been deleted';
                console.log('res property deleted', response);
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        );

    }

    addCardinality() {

        const onto = new UpdateOntology<UpdateResourceClassCardinality>();

        onto.lastModificationDate = this.ontology.lastModificationDate;

        onto.id = this.ontology.id;

        const addCard = new UpdateResourceClassCardinality();

        addCard.id = 'http://0.0.0.0:3333/ontology/0001/testonto/v2#testclass';

        addCard.cardinalities = [
            {
                propertyIndex: 'http://0.0.0.0:3333/ontology/0001/testonto/v2#hasName',
                cardinality: Cardinality._0_1
            }
        ];

        onto.entity = addCard;

        this.knoraApiConnection.v2.onto.addCardinalityToResourceClass(onto).subscribe(
            (res: ResourceClassDefinitionWithAllLanguages) => {
                this.addCard = res;
                console.log('added card: ', res)
            },
            err => console.error(err)
        );

    }

    replaceCardinality() {

        const onto = new UpdateOntology<UpdateResourceClassCardinality>();

        onto.lastModificationDate = this.ontology.lastModificationDate;

        onto.id = this.ontology.id;

        const replaceCard = new UpdateResourceClassCardinality();

        replaceCard.cardinalities = [
            {
                propertyIndex: 'http://0.0.0.0:3333/ontology/0001/testonto/v2#hasName',
                cardinality: Cardinality._1
            }
        ];

        replaceCard.id = 'http://0.0.0.0:3333/ontology/0001/testonto/v2#testclass';

        onto.entity = replaceCard;

        this.knoraApiConnection.v2.onto.replaceCardinalityOfResourceClass(onto).subscribe(
            (res: ResourceClassDefinitionWithAllLanguages) => {
                this.replacedCard = res;
                console.log('replace card: ', res)
            },
            err => console.error(err)
        );

    }


    getResourceClass(iri: string) {

        this.knoraApiConnection.v2.ontologyCache.getResourceClassDefinition(iri).subscribe(
            onto => {
                console.log('get res class', onto);
            }
        );
    }

    getResource(iri: string) {

        this.knoraApiConnection.v2.res.getResource(iri).pipe(
            map(
                (res) => { // make sure RxJS versions (Observable) are compatible
                    return res;
                })
        ).subscribe(
            (res: ReadResource) => {
                console.log(res);
                this.resource = res;

            },
            (error) => {

            }
        );

    }

    createResource() {

        const createResource = new CreateResource();

        createResource.label = 'testding';

        createResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';

        createResource.attachedToProject = 'http://rdfh.ch/projects/0001';

        const boolVal = new CreateBooleanValue();
        boolVal.bool = true;

        const props = {
            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean': [
                boolVal
            ]
        };

        createResource.properties = props;

        this.knoraApiConnection.v2.res.createResource(createResource).subscribe(
            (res: ReadResource) => {
                this.resource = res;
            }
        );

    }

    updateResourceMetadata() {

        const updateResourceMetadata = new UpdateResourceMetadata();

        updateResourceMetadata.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';

        updateResourceMetadata.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';

        updateResourceMetadata.label = 'Das Ding der Dinge';

        this.knoraApiConnection.v2.res.updateResourceMetadata(updateResourceMetadata).subscribe(
            (res: UpdateResourceMetadataResponse) => {
                this.resourceStatus = 'OK';
            }
        );
    }

    deleteResource() {

        const deleteResource = new DeleteResource();

        deleteResource.id = this.resource.id;

        deleteResource.type = this.resource.type;

        this.knoraApiConnection.v2.res.deleteResource(deleteResource).subscribe(
            (res: DeleteResourceResponse) => {
                this.resourceStatus = 'OK';
            }
        );

    }

    getListNode(listNodeIri: string) {

        this.knoraApiConnection.v2.listNodeCache.getNode(listNodeIri).subscribe(
            (res: ListNodeV2) => {
                console.log(res);

                this.listNode = res;

            }
        );
    }

    fulltextSearch(searchTerm: string) {

        this.knoraApiConnection.v2.search.doFulltextSearch(searchTerm, 0).subscribe(
            (res: ReadResourceSequence) => {
                this.searchResult = res.resources;
                this.size = res.resources.length;
            }
        );
    }

    fulltextSearchCountQuery(searchTerm: string) {

        this.knoraApiConnection.v2.search.doFulltextSearchCountQuery(searchTerm, 0).subscribe(
            (res: CountQueryResponse) => {
                console.log(res);
                this.size = res.numberOfResults;
            }
        );
    }

    labelSearch(searchTerm: string) {

        this.knoraApiConnection.v2.search.doSearchByLabel(searchTerm, 0).subscribe(
            (res: ReadResourceSequence) => {
                console.log(res);
                this.searchResult = res.resources;
                this.size = res.resources.length;
            }
        );
    }

    extendedSearch() {

        const gravsearchQuery = `
                PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
                CONSTRUCT {

                    ?mainRes knora-api:isMainResource true .

                } WHERE {

                    ?mainRes a knora-api:Resource .

                    ?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .
                }

                OFFSET 0
            `;

        this.knoraApiConnection.v2.search.doExtendedSearch(gravsearchQuery).subscribe(
            (res: ReadResourceSequence) => {
                console.log(res);
                this.searchResult = res.resources;
                this.size = res.resources.length;
            }
        );
    }

    extendedSearchCountQuery() {

        const gravsearchQuery = `
                PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
                CONSTRUCT {

                    ?mainRes knora-api:isMainResource true .

                } WHERE {

                    ?mainRes a knora-api:Resource .

                    ?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .
                }

                OFFSET 0
            `;

        this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearchQuery).subscribe(
            (res: CountQueryResponse) => {
                console.log(res);
                this.size = res.numberOfResults;
            }
        );
    }

    generateUpdateIntValue(int: number): UpdateResource<UpdateValue> {
        const updateIntVal = new UpdateIntValue();

        updateIntVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/dJ1ES8QTQNepFKF5-EAqdg';
        updateIntVal.int = int;

        const updateResource: UpdateResource<UpdateValue> = new UpdateResource<UpdateValue>();

        updateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
        updateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
        updateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';
        updateResource.value = updateIntVal;

        return updateResource;
    }

    updateValue(updateResource: UpdateResource<UpdateValue>) {

        this.knoraApiConnection.v2.values.updateValue(updateResource).subscribe((res: WriteValueResponse) => {
            console.log(res);
            this.valueStatus = 'OK';
        },
            error => {
                this.valueStatus = '';
            }
        );

    }

    generateCreateIntValue(int: number): UpdateResource<CreateValue> {
        const createIntVal = new CreateIntValue();
        createIntVal.int = int;

        const updateResource: UpdateResource<CreateValue> = new UpdateResource<CreateValue>();

        updateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
        updateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
        updateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';
        updateResource.value = createIntVal;

        return updateResource;
    }

    createValue(updateResource: UpdateResource<CreateValue>) {

        this.knoraApiConnection.v2.values.createValue(updateResource).subscribe((res: WriteValueResponse) => {
            console.log(res);
            this.valueStatus = 'OK';
        },
            error => {
                this.valueStatus = '';
            }
        );

    }

    deleteValue() {

        const deleteVal = new DeleteValue();

        deleteVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/bXMwnrHvQH2DMjOFrGmNzg';
        deleteVal.type = Constants.DecimalValue;

        const updateResource: UpdateResource<DeleteValue> = new UpdateResource<DeleteValue>();

        updateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
        updateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
        updateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal';
        updateResource.value = deleteVal;

        this.knoraApiConnection.v2.values.deleteValue(updateResource).subscribe((res: DeleteValueResponse) => {
            console.log(res);
            this.valueStatus = 'OK';
        },
            error => {
                this.valueStatus = '';
            }
        );
    }

    getValue(resourceIri: string, valueUuid: string) {

        this.knoraApiConnection.v2.values.getValue(resourceIri, valueUuid).subscribe(
            (res: ReadResource) => {
                console.log(res);
                this.valueStatus = 'OK';
            },
            error => {
                this.valueStatus = '';
            }
        );

    }

    getProjectMetadata(): void {
        const resourceIri = 'http://rdfh.ch/projects/0001';

        this.knoraApiConnection.v2.metadata.getProjectMetadata(resourceIri).subscribe(
            (res: ProjectsMetadata) => {
                console.log('GET', JSON.stringify(res), res);
                this.projectMetaStatus = 'OK';
            },
            error => {
                this.projectMetaStatus = 'Error';
            }
        );
    }

    updateProjectMetadata(): void {
        const resourceIri = 'http://rdfh.ch/projects/0001';

        const testMetadata = new ProjectsMetadata();
        const testDataset = new Dataset();
        testDataset.id = 'http://ns.dasch.swiss/test-dataset';
        testDataset.type = Constants.DspRepoBase + 'Dataset';
        testDataset.abstract = ['Dies ist ein Testprojekt.'];
        // testDataset.alternativeTitle = 'test';
        testDataset.conditionsOfAccess = 'Open Access';
        // testDataset.dateCreated = '2001-09-26';
        // testDataset.dateModified = '2020-04-26';
        // testDataset.datePublished = '2002-09-24';
        // testDataset.distribution = { type: 'https://schema.org/DataDownload', url: 'https://test.dasch.swiss' } as IUrl;
        // testDataset.documentation = ['Work in progress', 'Dddddd'];
        testDataset.howToCite = 'Testprojekt (test), 2002, https://test.dasch.swiss';
        testDataset.language = [ 'EN', 'DE', 'FR' ];
        testDataset.license = [{ type: Constants.SchemaUrlType, url: 'https://creativecommons.org/licenses/by/3.0' }] as IUrl[];
        testDataset.qualifiedAttribution = [
            {
                type: Constants.ProvAttribution,
                role: ['contributor', 'watcher'],
                agent: [{id: 'http://ns.dasch.swiss/test-berry'}]
            },
            {
                type: Constants.ProvAttribution,
                role: ['contributor'],
                agent: [{id: 'http://ns.dasch.swiss/test-hart'}]
            },
            {
                type: Constants.ProvAttribution,
                role: ['editor'],
                agent: [{id: 'http://ns.dasch.swiss/test-abraham'}]
            },
            {
                type: Constants.ProvAttribution,
                role: ['editor'],
                agent: [{id: 'http://ns.dasch.swiss/test-coleman'}]
            },
            {
                type: Constants.ProvAttribution,
                role: ['editor'],
                agent: [{id: 'http://ns.dasch.swiss/test-jones'}]
            }
         ];
        testDataset.status = 'ongoing';
        testDataset.title = 'Testprojekt';
        testDataset.typeOfData = ['image', 'text'];
        // testDataset.sameAs = { type: Constants.SchemaUrlType, url: 'https://test.dasch.swiss' } as IUrl;
        testDataset.project = new SingleProject();
        testDataset.project.id = 'http://ns.dasch.swiss/test-project';
        testDataset.project.type = Constants.DspRepoBase + 'Project';
        // testDataset.project.alternateName = 'test';
        // testDataset.project.contactPoint = {
        //     'id': 'http://ns.dasch.swiss/test-abraham',
        //     type: Constants.DspRepoBase + 'Person',
        //     'address': {
        //         type: Constants.SchemaPostalAddress,
        //        'addressLocality': 'Basel',
        //        'postalCode': '4000',
        //        'streetAddress': 'Teststrasse'
        //     },
        //     'email': ['stewart.abraham@test.ch', 'test@test.ch'],
        //     'familyName': 'Abraham',
        //     'givenName': 'Stewart',
        //     'jobTitle': ['Dr.', 'Dre'],
        //     'memberOf': {id: 'http://ns.dasch.swiss/test-dasch'},
        //     'sameAs': {
        //        'type': Constants.SchemaUrlType,
        //        'url': 'https://orcid.org/0000-0002-1825-0097'
        //     }
        //  } as Person;
        testDataset.project.dataManagementPlan = {
            'id': 'http://ns.dasch.swiss/test-plan',
            type: Constants.DspRepoBase + 'DataManagementPlan',
            'url': [{
               'type': Constants.SchemaUrlType,
               'url': 'https://snf.ch'
            }],
            'isAvailable': false
         } as DataManagementPlan;
        testDataset.project.description = 'Dies ist ein Testprojekt...alle Properties wurden verwendet, um diese zu testen';
        testDataset.project.discipline = [{
            'name': 'SKOS UNESCO Nomenclature',
            'type': Constants.SchemaUrlType,
            'url': 'http://skos.um.es/unesco6/11'
         }];
        // testDataset.project.endDate = '2001-01-26';
        testDataset.project.funder = [{
            'id': 'http://ns.dasch.swiss/test-funder'
        }];
        const grant = new Grant();
        grant.id = 'http://ns.dasch.swiss/test-grant';
        grant.type = Constants.DspRepoBase + 'Grant',
        grant.funder = [{
            'id': 'http://ns.dasch.swiss/test-funder',
            type: Constants.DspRepoBase + 'Organization',
            'address': {
                type: Constants.SchemaPostalAddress,
                'addressLocality': 'Toronto',
                'postalCode': '40000',
                'streetAddress': 'University of Toronto Street'
            },
            'email': 'info@universityoftoronto.ca',
            'name': ['University of Toronto', 'WWW'],
            'url': [{
                'type': Constants.SchemaUrlType,
                'name': 'cos',
                'url': 'http://www.utoronto.ca/'
            }]
        }] as Organization[];
        // grant.name = 'Prof. test test, Prof. test Harbtestrecht';
        // grant.number = '0123456789';
        // grant.url = {
        //     'type': Constants.SchemaUrlType,
        //     'url': 'http://p3.snf.ch/testproject'
        //  };
        testDataset.project.grant = [grant];
        testDataset.project.keywords = ['science'];
        testDataset.project.name = 'Testprojektname (test)';
        testDataset.project.publication = ['testpublication'];
        testDataset.project.shortcode = '0000';
        testDataset.project.spatialCoverage = [
            {
               'place': {
                  'name': 'Geonames',
                  'url': 'https://www.geonames.org/2017370/russian-federation.html'
               }
            },
            {
               'place': {
                  'name': 'Geonames',
                  'url': 'https://www.geonames.org/2658434/switzerland.html'
               }
            },
            {
               'place': {
                  'name': 'Geonames',
                  'url': 'https://www.geonames.org/3175395/italian-republic.html'
               }
            },
            {
               'place': {
                  'name': 'Geonames',
                  'url': 'https://www.geonames.org/2921044/federal-republic-of-germany.html'
               }
            },
            {
               'place': {
                  'name': 'Geonames',
                  'url': 'https://www.geonames.org/3017382/republic-of-france.html'
               }
            },
            {
               'place': {
                  'name': 'Geonames',
                  'url': 'https://www.geonames.org/6269131/england.html'
               }
            },
            {
               'place': {
                  'name': 'Geonames',
                  'url': 'https://www.geonames.org/6255148/europe.html'
               }
            }
        ];
        testDataset.project.startDate = '2000-07-26';
        testDataset.project.temporalCoverage = [{
            'name': 'Chronontology Dainst',
            'type': Constants.SchemaUrlType,
            'url': 'http://chronontology.dainst.org/period/Ef9SyESSafJ1'
        }];
        testDataset.project.url = [{
            'type': Constants.SchemaUrlType,
            'url': 'https://test.dasch.swiss/'
        }];
        // const testPersonOne = {
        //     'id': 'http://ns.dasch.swiss/test-jones',
        //     type: Constants.DspRepoBase + 'Person',
        //     'address': {
        //         type: Constants.SchemaPostalAddress,
        //        'addressLocality': 'Basel',
        //        'postalCode': '4000',
        //        'streetAddress': 'Teststrasse'
        //     },
        //     'email': 'benjamin.jones@test.ch',
        //     'familyName': 'Jones',
        //     'givenName': 'Benjamin',
        //     'jobTitle': 'Dr. des.',
        //     'memberOf': {id: 'http://ns.dasch.swiss/test-dasch'},
        // } as Person;
        // const testPersonTwo = {
        //     'id': 'http://ns.dasch.swiss/test-coleman',
        //     type: Constants.DspRepoBase + 'Person',
        //     'address': {
        //         type: Constants.SchemaPostalAddress,
        //        'addressLocality': 'Basel',
        //        'postalCode': '4000',
        //        'streetAddress': 'Teststrasse'
        //     },
        //     'email': 'james.coleman@dasch.swiss',
        //     'familyName': 'Coleman',
        //     'givenName': 'James',
        //     'jobTitle': 'Dr. des.',
        //     'memberOf': {id: 'http://ns.dasch.swiss/test-dasch'},
        // } as Person;
        // const testPersonThree = {
        //     'id': 'http://ns.dasch.swiss/test-berry',
        //     type: Constants.DspRepoBase + 'Person',
        //     'address': {
        //         type: Constants.SchemaPostalAddress,
        //        'addressLocality': 'Basel',
        //        'postalCode': '4000',
        //        'streetAddress': 'Teststrasse'
        //     },
        //     'email': 'lauren.berry@unibas.ch',
        //     'familyName': 'Berry',
        //     'givenName': 'Lauren',
        //     'jobTitle': 'Dr.',
        //     'memberOf': {id: 'http://ns.dasch.swiss/test-dasch'},
        // } as Person;
        // const testPersonFour = {
        //     'id': 'http://ns.dasch.swiss/test-hart',
        //     type: Constants.DspRepoBase + 'Person',
        //     'address': {
        //         type: Constants.SchemaPostalAddress,
        //        'addressLocality': 'Basel',
        //        'postalCode': '4000',
        //        'streetAddress': 'Teststrasse'
        //     },
        //     'email': 'leonhard.hart@test.ch',
        //     'familyName': 'Hart',
        //     'givenName': 'Leonhard',
        //     'jobTitle': 'Prof.',
        //     'memberOf': {id: 'http://ns.dasch.swiss/test-dasch'},
        // } as Person;
        testMetadata.projectsMetadata.push(testDataset);
        console.log(testMetadata, JSON.stringify(testMetadata));
        this.knoraApiConnection.v2.metadata.updateProjectMetadata(resourceIri, testMetadata).subscribe(
            (res: UpdateProjectMetadataResponse) => {
                console.log('PUT', res);
                this.projectMetaStatus = 'OK';
            },
            error => {
                this.projectMetaStatus = 'Error';
            }
        );
    }

    updateChildNode(): void {
        const childNode = new UpdateChildNodeRequest();

        const newLabels = new StringLiteral();
        newLabels.language = 'en';
        newLabels.value = 'updated label';

        childNode.labels = [newLabels];

        const newComments = new StringLiteral();
        newComments.language = 'en';
        newComments.value = 'updated comment';

        childNode.comments = [newComments];

        childNode.listIri = 'http://rdfh.ch/lists/0001/treeList01';

        childNode.projectIri = 'http://rdfh.ch/projects/0001';

        this.knoraApiConnection.admin.listsEndpoint.updateChildNode(childNode).subscribe(
            (res: ApiResponseData<ChildNodeInfoResponse>) => {
                this.listChildLabels =
                    res.body.nodeinfo.labels[0].language
                    + '/'
                    + res.body.nodeinfo.labels[0].value;

                this.listChildComments =
                    res.body.nodeinfo.comments[0].language
                    + '/'
                    + res.body.nodeinfo.comments[0].value;

                this.listChildName = res.body.nodeinfo.name;
            }
        );
    }

    updateChildName(): void {
        const childNodeName = new UpdateChildNodeNameRequest();

        const listItemIri = 'http://rdfh.ch/lists/0001/treeList01';

        const newName = 'updated child name';

        childNodeName.name = newName;

        this.knoraApiConnection.admin.listsEndpoint.updateChildName(listItemIri, childNodeName).subscribe(
            (res: ApiResponseData<ChildNodeInfoResponse>) => {
                this.listChildName = res.body.nodeinfo.name;
            }
        );
    }

    updateChildLabels(): void {
        const childNodeLabels = new UpdateChildNodeLabelsRequest();

        const listItemIri = 'http://rdfh.ch/lists/0001/treeList01';

        const newLabels = new StringLiteral();
        newLabels.language = 'en';
        newLabels.value = 'new label';

        childNodeLabels.labels = [newLabels];

        this.knoraApiConnection.admin.listsEndpoint.updateChildLabels(listItemIri, childNodeLabels).subscribe(
            (res: ApiResponseData<ChildNodeInfoResponse>) => {
                this.listChildLabels =
                    res.body.nodeinfo.labels[0].language
                    + '/'
                    + res.body.nodeinfo.labels[0].value;
            }
        );
    }

    updateChildComments(): void {
        const childNodeComments = new UpdateChildNodeCommentsRequest();

        const listItemIri = 'http://rdfh.ch/lists/0001/treeList01';

        const newComments = new StringLiteral();
        newComments.language = 'en';
        newComments.value = 'new comment';

        childNodeComments.comments = [newComments];

        this.knoraApiConnection.admin.listsEndpoint.updateChildComments(listItemIri, childNodeComments).subscribe(
            (res: ApiResponseData<ChildNodeInfoResponse>) => {
                this.listChildComments =
                    res.body.nodeinfo.comments[0].language
                    + '/'
                    + res.body.nodeinfo.comments[0].value;
            }
        );
    }

    getListNodeInfo(): void {
        const listItemIri = 'http://rdfh.ch/lists/0001/treeList01';

        this.knoraApiConnection.admin.listsEndpoint.getListNodeInfo(listItemIri).subscribe(
            (res: ApiResponseData<ListNodeInfoResponse>) => {
                console.log(res);

                this.listNodeId = res.body.nodeinfo.id;

            }
        );
    }

    createList(): void {
        const list = new CreateListRequest();

        list.projectIri = 'http://rdfh.ch/projects/0001';

        const label = new StringLiteral();
        label.language = 'de';
        label.value = 'Neue Liste';

        list.labels = [label];

        const comments = new StringLiteral();
        comments.language = 'de';
        comments.value = 'Neuer Kommentar';

        list.comments = [comments];

        this.knoraApiConnection.admin.listsEndpoint.createList(list).subscribe(
            (res: ApiResponseData<ListResponse>) => {

                this.listLabels =
                    res.body.list.listinfo.labels[0].language
                    + '/'
                    + res.body.list.listinfo.labels[0].value;

                this.listComments =
                    res.body.list.listinfo.comments[0].language
                    + '/'
                    + res.body.list.listinfo.comments[0].value;
            }
        );
    }

    createListChildNode(): void {
        const createRequest = new CreateChildNodeRequest();
        createRequest.parentNodeIri = 'http://rdfh.ch/lists/0001/notUsedList';
        createRequest.projectIri = 'http://rdfh.ch/projects/0001';
        createRequest.name = 'new child node';
        createRequest.labels = [{ 'value': 'New Child List Node Value', 'language': 'en'}];
        createRequest.comments = [{ 'value': 'New Child List Node Comment', 'language': 'en'}];

        this.knoraApiConnection.admin.listsEndpoint.createChildNode(createRequest).subscribe(
            (res: ApiResponseData<ListNodeInfoResponse>) => {
                this.listChildLabels =
                    res.body.nodeinfo.labels[0].language
                    + '/'
                    + res.body.nodeinfo.labels[0].value;

                this.listChildComments =
                    res.body.nodeinfo.comments[0].language
                    + '/'
                    + res.body.nodeinfo.comments[0].value;

                this.listChildName = res.body.nodeinfo.name;

                this.listNodePosition = res.body.nodeinfo.position;
            }
        );
    }

    createListChildNodeAtPosition(): void {
        const createRequest = new CreateChildNodeRequest();
        createRequest.parentNodeIri = 'http://rdfh.ch/lists/0001/notUsedList';
        createRequest.projectIri = 'http://rdfh.ch/projects/0001';
        createRequest.name = 'new child node at position 1';
        createRequest.labels = [{ 'value': 'New Child List Node at Position 1 Value', 'language': 'en'}];
        createRequest.comments = [{ 'value': 'New Child List Node at Position 1 Comment', 'language': 'en'}];
        createRequest.position = 1;

        this.knoraApiConnection.admin.listsEndpoint.createChildNode(createRequest).subscribe(
            (res: ApiResponseData<ListNodeInfoResponse>) => {
                this.listChildLabels =
                    res.body.nodeinfo.labels[0].language
                    + '/'
                    + res.body.nodeinfo.labels[0].value;

                this.listChildComments =
                    res.body.nodeinfo.comments[0].language
                    + '/'
                    + res.body.nodeinfo.comments[0].value;

                this.listChildName = res.body.nodeinfo.name;

                this.listNodePosition = res.body.nodeinfo.position;
            }
        );
    }

    getList(): void {
        const listItemIri = 'http://rdfh.ch/lists/0001/treeList';

        this.knoraApiConnection.admin.listsEndpoint.getList(listItemIri).subscribe(
            (res: ApiResponseData<ListResponse>) => {
                this.listName = res.body.list.listinfo.name;
                this.listChildren = res.body.list.children.length;
            }
        );
    }

    deleteListChildNode(): void {
        const listItemIri = 'http://rdfh.ch/lists/0001/notUsedList015';

        this.knoraApiConnection.admin.listsEndpoint.deleteListNode(listItemIri).subscribe(
            (res: ApiResponseData<DeleteListNodeResponse>) => {
                this.listChildren = res.body.node.children.length;
            }
        );
    }

    deleteListRootNode(): void {
        const listItemIri = 'http://rdfh.ch/lists/0001/notUsedList';

        this.knoraApiConnection.admin.listsEndpoint.deleteListNode(listItemIri).subscribe(
            (res: ApiResponseData<DeleteListResponse>) => {
                this.listNodeDeleted = res.body.deleted;
            },
            err => console.error('Error:', err)
        );
    }

    repositionListChildNode(): void {
        const childNodeIri = 'http://rdfh.ch/lists/0001/notUsedList01';

        const repositionRequest = new RepositionChildNodeRequest();
        repositionRequest.parentNodeIri = 'http://rdfh.ch/lists/0001/notUsedList';
        repositionRequest.position = -1;

        this.knoraApiConnection.admin.listsEndpoint.repositionChildNode(childNodeIri, repositionRequest).subscribe(
            (res: ApiResponseData<RepositionChildNodeResponse>) => {
                this.listNodePosition = res.body.node.children[res.body.node.children.length - 1].position;
                this.listNodeParentIri = res.body.node.children[res.body.node.children.length - 1].hasRootNode;
            },
            err => console.error('Error:', err)
        );
    }

    repositionListChildNodeNewParent(): void {
        const childNodeIri = 'http://rdfh.ch/lists/0001/notUsedList01';

        const repositionRequest = new RepositionChildNodeRequest();
        repositionRequest.parentNodeIri = 'http://rdfh.ch/lists/0001/notUsedList02';
        repositionRequest.position = -1;

        this.knoraApiConnection.admin.listsEndpoint.repositionChildNode(childNodeIri, repositionRequest).subscribe(
            (res: ApiResponseData<RepositionChildNodeResponse>) => {
                this.listNodePosition = res.body.node.children[res.body.node.children.length - 1].position;
                this.listNodeParentIri = res.body.node.children[res.body.node.children.length - 1].hasRootNode;
            },
            err => console.error('Error:', err)
        );
    }

}
