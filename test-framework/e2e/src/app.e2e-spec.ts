import {AppPage} from './app.po';
import {browser, logging} from 'protractor';

/**
 * Attempts to convert a string to a number.
 *
 * @param numStr string to be converted to a number.
 */
const convertTextToNumber = (numStr): number => {
  if (isNaN(numStr)) throw new Error(`${numStr} cannot be converted to a number`);
  return Number(numStr);
}

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Welcome to knora-api-js-lib-test!');
  });

  it('should log in', () => {

    page.navigateTo();

    const button = page.getEle('div section#login button.login');

    button.click();

    const status = page.getEle('div section#login span.status');

    expect(status.getText()).toEqual('logged in');

  });

  it('should log out', () => {

    page.navigateTo();

    const button = page.getEle('div section#login button.logout');

    button.click();

    const status = page.getEle('div section#login span.status');

    expect(status.getText()).toEqual('logged out');

  });

  it('request a project\'s permissions', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.get-permissions');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getPermissions ok');

  });

  it('request an administrative permission', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.get-administrative-permission');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getAdministrativePermission ok');

  });

  it('update an administrative permission', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.get-administrative-permission');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getAdministrativePermission ok');

    const button2 = page.getEle('div#permissions button.update-administrative-permission');
    button2.click();

    const label2 = page.getEle('div#permissions span.update-status');
    expect(label2.getText()).toEqual('Permission update status: updateAdministrativePermission ok');

  });

  it('update an administrative permission\'s group', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.create-administrative-permission');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: createAdministrativePermission ok');

    const button2 = page.getEle('div#permissions button.update-administrative-permission-group');
    button2.click();

    const label2 = page.getEle('div#permissions span.update-status');
    expect(label2.getText()).toEqual('Permission update status: updateAdministrativePermissionGroup ok');

  });

  it('delete an administrative permission', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get the admin permission first to assign the Iri
    const button = page.getEle('div#permissions button.get-administrative-permission');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getAdministrativePermission ok');

    const button2 = page.getEle('div#permissions button.delete-permission');
    button2.click();

    const label2 = page.getEle('div#permissions span.deleted');
    expect(label2.getText()).toEqual('Permission deleted: true');

  });

  it('request administrative permissions', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.get-administrative-permissions');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getAdministrativePermissions ok');

  });

  it('create an administrative permission', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.create-administrative-permission');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: createAdministrativePermission ok');

  });

  it('request default object access permissions', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.get-default-object-access-permissions');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getDefaultObjectAccessPermissions ok');

  });

  it('update a default object access permission', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.get-default-object-access-permissions');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getDefaultObjectAccessPermissions ok');

    const button2 = page.getEle('div#permissions button.update-default-object-access-permission');
    button2.click();

    const label2 = page.getEle('div#permissions span.update-status');
    expect(label2.getText()).toEqual('Permission update status: updateDefaultObjectAccessPermission ok');

  });

  it('update an administrative permission\'s group', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.get-default-object-access-permissions');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getDefaultObjectAccessPermissions ok');

    const button2 = page.getEle('div#permissions button.update-default-object-access-permission-group');
    button2.click();

    const label2 = page.getEle('div#permissions span.update-status');
    expect(label2.getText()).toEqual('Permission update status: updateDefaultObjectAccessPermissionGroup ok');

  });

  it('update an administrative permission\'s resource class', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.get-default-object-access-permissions');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getDefaultObjectAccessPermissions ok');

    const button2 = page.getEle('div#permissions button.update-default-object-access-permission-resource-class');
    button2.click();

    const label2 = page.getEle('div#permissions span.update-status');
    expect(label2.getText()).toEqual('Permission update status: updateDefaultObjectAccessPermissionResourceClass ok');

  });

  it('update an administrative permission\'s property', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.get-default-object-access-permissions');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: getDefaultObjectAccessPermissions ok');

    const button2 = page.getEle('div#permissions button.update-default-object-access-permission-property');
    button2.click();

    const label2 = page.getEle('div#permissions span.update-status');
    expect(label2.getText()).toEqual('Permission update status: updateDefaultObjectAccessPermissionProperty ok');

  });

  it('create a default object access permission', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#permissions button.create-default-object-access-permission');
    button.click();

    const label = page.getEle('div#permissions span.status');
    expect(label.getText()).toEqual('Permission status: createDefaultObjectAccessPermission ok');

  });

  it('request the knora-api system ontology', () => {

    page.navigateTo();

    const button = page.getEle('div section#ontologycache button.knora-api');

    button.click();

    const size = page.getEle('div section#ontologycache span.ontology');

    expect(size.getText()).toEqual('1');

  });

  it('request the anything ontology', () => {

    page.navigateTo();

    const button = page.getEle('div section#ontologycache button.anything');

    button.click();

    const size = page.getEle('div section#ontologycache span.ontology');

    expect(size.getText()).toEqual('2');

  });

  it('request the something ontology', () => {

    page.navigateTo();

    const button = page.getEle('div section#ontologycache button.something');

    button.click();

    const size = page.getEle('div section#ontologycache span.ontology');

    expect(size.getText()).toEqual('3');

  });

  it('request the anything project ontologies', () => {

    page.navigateTo();

    const button = page.getEle('div section#ontologymetadata button.anything');

    button.click();

    const result = page.getEle('div section#ontologymetadata span.anything');
    expect(result.getText()).toEqual('3 ontologies');

  });

  it('request the anything project ontologies with all languages', () => {

    page.navigateTo();

    const button = page.getEle('div section#ontologyendpoint button.anything');

    button.click();

    const result = page.getEle('div section#ontologyendpoint span.ontology');
    expect(result.getText()).toEqual('The anything ontology');

  });

  it('request the dokubib project ontologies', () => {

    page.navigateTo();

    const button = page.getEle('div section#ontologymetadata button.dokubib');

    button.click();

    const result = page.getEle('div section#ontologymetadata span.dokubib');
    expect(result.getText()).toEqual('1 ontology');

  });

  it('create new "testonto" ontology in anything project', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // create testonto
    const button = page.getEle('div section#ontologyeditor button.create-onto');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.label');
    expect(label.getText()).toEqual('Test Ontology');

  });

  it('update "testonto" ontology metadata with a new label', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // update testonto label
    const button = page.getEle('div section#ontologyeditor button.update-onto-metadata-label');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.read-label');
    expect(label.getText()).toEqual('Test Onto');

  });

  it('update "testonto" ontology metadata with a new comment', () => {
    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // update testonto comment
    const button = page.getEle('div section#ontologyeditor button.update-onto-metadata-comment');
    button.click();
    const comment = page.getEle('div section#ontologyeditor span.read-comment');
    expect(comment.getText()).toEqual('Ontology comment updated');
  });

  it('update "testonto" ontology metadata with a new label and comment', () => {
    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // update testonto label and comment
    const button = page.getEle('div section#ontologyeditor button.update-onto-metadata-label-and-comment');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.read-label');
    expect(label.getText()).toEqual('Test Onto New Label');
    const comment = page.getEle('div section#ontologyeditor span.read-comment');
    expect(comment.getText()).toEqual('Test Onto New Comment');
  });

  it('remove comment from "testonto" ontology metadata', () => {
    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // remove testonto comment
    const button = page.getEle('div section#ontologyeditor button.remove-onto-metadata-comment');
    button.click();
    const comment = page.getEle('div section#ontologyeditor span.read-comment');
    expect(comment.getText()).toEqual('');
  });

  // TODO: create res class / update following example
  it('create new "testclass" resource class in testonto of anything project', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // create res class
    const button = page.getEle('div section#ontologyeditor button.create-res-class');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.res-class-label');
    expect(label.getText()).toEqual('Test Klasse');

  });

  it('change a resource classes\'s comment', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // update res class label
    const button = page.getEle('div section#ontologyeditor button.update-res-class-comment');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.res-class-comment');
    expect(label.getText()).toEqual('Just an example of a new resource class new');

  });

  it('change a resource classes\'s label', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // update res class label
    const button = page.getEle('div section#ontologyeditor button.update-res-class-label');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.res-class-label');
    expect(label.getText()).toEqual('Test Klasse neu');

  });

  it('create a new property in testonto of the anything project', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // create property
    const button = page.getEle('div section#ontologyeditor button.create-res-prop');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.res-prop-label');

    expect(label.getText()).toEqual('hat Namen');
  });

  it('change a resource property\'s comment', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // update res class label
    const button = page.getEle('div section#ontologyeditor button.update-res-prop-comment');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.res-prop-comment');
    expect(label.getText()).toEqual('Der Name eines Dinges neu');

  });

  it('change a resource property\'s label', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // update res class label
    const button = page.getEle('div section#ontologyeditor button.update-res-prop-label');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.res-prop-label');
    expect(label.getText()).toEqual('hat Namen neu');

  });

  it('add a cardinality to a resource class in testonto', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // add cardinality
    const button = page.getEle('div section#ontologyeditor button.add-card-to-res-prop');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.res-card-added');

    expect(label.getText()).toEqual('Test Klasse neu');

  });

  it('replace a cardinality to a resource class in testonto', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // add cardinality
    const button = page.getEle('div section#ontologyeditor button.replace-card-for-res-prop');
    button.click();
    const label = page.getEle('div section#ontologyeditor span.res-card-replaced');

    expect(label.getText()).toEqual('Test Klasse neu');

  });

  it('delete "testclass" resource class', () => {
    
    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // delete testclass
    const button = page.getEle('div section#ontologyeditor button.delete-res-class');
    button.click();
    const msg = page.getEle('div section#ontologyeditor span.status');
    expect(msg.getText()).toEqual('res class has been deleted');

  });

  it('delete "has name" property', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // delete property
    const button = page.getEle('div section#ontologyeditor button.delete-res-prop');
    button.click();
    const msg = page.getEle('div section#ontologyeditor span.status');
    expect(msg.getText()).toEqual('res property has been deleted');


  });

  it('delete "testonto" ontology', () => {
    
    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    // get testonto to have lastModificationDate
    const getButton = page.getEle('div section#ontologyeditor button.read-onto');
    getButton.click();

    // delete testonto
    const button = page.getEle('div section#ontologyeditor button.delete-onto');
    button.click();
    const msg = page.getEle('div section#ontologyeditor span.status');
    expect(msg.getText()).toEqual('Ontology http://0.0.0.0:3333/ontology/0001/testonto/v2 has been deleted');

  });

  it('request a resource', () => {

    page.navigateTo();

    const button = page.getEle('div section#resource button.read');

    button.click();

    const label = page.getEle('div section#resource span.label');

    expect(label.getText()).toEqual('testding');

  });

  it('update a resource\'s metadata', () => {

    page.navigateTo();

    const loginButton = page.getEle('div section#login button.login');

    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');

    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div section#resource button.update');

    button.click();

    const label = page.getEle('div section#resource span.status');

    expect(label.getText()).toEqual('OK');

  });

  it('request a list node', () => {

    page.navigateTo();

    const button = page.getEle('div section#listnode button');

    button.click();

    const label = page.getEle('div section#listnode span.label');

    expect(label.getText()).toEqual('Tree list node 01');

  });

  it('perform a fulltext search', () => {

    page.navigateTo();

    const button = page.getEle('div section#search button.fulltext');

    button.click();

    const size = page.getEle('div section#search span.size');

    expect(size.getText().then(convertTextToNumber)).toBeGreaterThan(0);

  });

  it('perform a fulltext search count query', () => {

    page.navigateTo();

    const button = page.getEle('div section#search button.fulltext');

    button.click();

    const size = page.getEle('div section#search span.size');

    expect(size.getText().then(convertTextToNumber)).toBeGreaterThan(0);

  });

  it('perform a label search', () => {

    page.navigateTo();

    const button = page.getEle('div section#search button.labelsearch');

    button.click();

    const size = page.getEle('div section#search span.size');

    expect(size.getText().then(convertTextToNumber)).toBeGreaterThan(0);

  });

  it('perform an extended search', () => {

    page.navigateTo();

    const button = page.getEle('div section#search button.extended');

    button.click();

    const size = page.getEle('div section#search span.size');

    expect(size.getText().then(convertTextToNumber)).toBeGreaterThan(0);

  });

  it('perform an extended search count query', () => {

    page.navigateTo();

    const button = page.getEle('div section#search button.extendedcount');

    button.click();

    const size = page.getEle('div section#search span.size');

    expect(size.getText().then(convertTextToNumber)).toBeGreaterThan(0);

  });

  it('read a value', () => {

    page.navigateTo();

    const button = page.getEle('div section#values button.read');

    button.click();

    const size = page.getEle('div section#values span.status');

    expect(size.getText()).toEqual('OK');

  });

  it('update a value', () => {

    page.navigateTo();

    const loginButton = page.getEle('div section#login button.login');

    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');

    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div section#values button.update');

    button.click();

    const size = page.getEle('div section#values span.status');

    expect(size.getText()).toEqual('OK');

  });

  it('create a value', () => {

    page.navigateTo();

    const loginButton = page.getEle('div section#login button.login');

    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');

    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div section#values button.create');

    button.click();

    const size = page.getEle('div section#values span.status');

    expect(size.getText()).toEqual('OK');

  });

  it('delete a value', () => {

    page.navigateTo();

    const loginButton = page.getEle('div section#login button.login');

    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');

    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div section#values button.delete');

    button.click();

    const size = page.getEle('div section#values span.status');

    expect(size.getText()).toEqual('OK');

  });

  it('create a resource', () => {

    page.navigateTo();

    const loginButton = page.getEle('div section#login button.login');

    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');

    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div section#resource button.create');

    button.click();

    const label = page.getEle('div section#resource span.label');

    expect(label.getText()).toEqual('testding');

  });

  it('delete a resource', () => {

    page.navigateTo();

    const loginButton = page.getEle('div section#login button.login');

    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');

    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div section#resource button.create');

    button.click();

    const label = page.getEle('div section#resource span.label');

    expect(label.getText()).toEqual('testding');

    const button2 = page.getEle('div section#resource button.delete');

    button2.click();

    const label2 = page.getEle('div section#resource span.status');

    expect(label2.getText()).toEqual('OK');

  });

  it('it should update a project metadata', () => {

    page.navigateTo();

    const loginButton = page.getEle('div section#login button.login');

    loginButton.click();

    const loginStatus = page.getEle('div section#login span.status');

    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div section#metadata button.update');

    button.click();

    const status = page.getEle('div section#metadata span.status');

    expect(status.getText()).toEqual('OK');

  });

  it('it should get project metadata', () => {

    page.navigateTo();

    const button = page.getEle('div section#metadata button.read');

    button.click();

    const status = page.getEle('div section#metadata span.status');

    expect(status.getText()).toEqual('OK');

  });

  it('should update the name of a list child node', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#lists button.update-child-name');

    button.click();

    const childName = page.getEle('div#lists span.child-name');

    expect(childName.getText()).toEqual('updated child name');
  });

  it('should update the labels of a list child node', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#lists button.update-child-labels');

    button.click();

    const childLabel = page.getEle('div#lists span.child-labels');

    expect(childLabel.getText()).toEqual('en/new label');
  });

  it('should update the comments of a list child node', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#lists button.update-child-comments');

    button.click();

    const childName = page.getEle('div#lists span.child-comments');

    expect(childName.getText()).toEqual('en/new comment');
  });

  it('should update the labels and comments of a list child node', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#lists button.update-list-child-node');

    button.click();

    const childLabel = page.getEle('div#lists span.child-labels');

    expect(childLabel.getText()).toEqual('en/updated label');

    const childComment = page.getEle('div#lists span.child-comments');

    expect(childComment.getText()).toEqual('en/updated comment');
  });

  it('should get a list', () => {

    page.navigateTo();

    const button = page.getEle('div#lists button.get-list');

    button.click();

    const listName = page.getEle('div#lists span.list-name');

    expect(listName.getText()).toEqual('treelistroot');

    const listChildren = page.getEle('div#lists span.list-children');

    expect(listChildren.getText()).toEqual('3');
  });

  it('should get info of a list node', () => {

    page.navigateTo();

    const button = page.getEle('div#lists button.get-list-node-info');

    button.click();

    const listNodeId = page.getEle('div#lists span.list-node-id');

    expect(listNodeId.getText()).toEqual('http://rdfh.ch/lists/0001/treeList01');
  });

  it('should create a list', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#lists button.create-list');

    button.click();

    const listLabel = page.getEle('div#lists span.list-labels');

    expect(listLabel.getText()).toEqual('de/Neue Liste');

    const listComment = page.getEle('div#lists span.list-comments');

    expect(listComment.getText()).toEqual('de/Neuer Kommentar');
  });

  it('should create a list child node', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#lists button.create-list-child-node');

    button.click();

    const listChildNodeName = page.getEle('div#lists span.child-name');

    expect(listChildNodeName.getText()).toEqual('new child node');

    const listChildNodeLabel = page.getEle('div#lists span.child-labels');

    expect(listChildNodeLabel.getText()).toEqual('en/New Child List Node Value');

    const listChildNodeComment = page.getEle('div#lists span.child-comments');

    expect(listChildNodeComment.getText()).toEqual('en/New Child List Node Comment');
  });

  it('should create a list child node at position 1', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#lists button.create-list-child-node-at-position');

    button.click();

    const listChildNodeName = page.getEle('div#lists span.child-name');

    expect(listChildNodeName.getText()).toEqual('new child node at position 1');

    const listChildNodeLabel = page.getEle('div#lists span.child-labels');

    expect(listChildNodeLabel.getText()).toEqual('en/New Child List Node at Position 1 Value');

    const listChildNodeComment = page.getEle('div#lists span.child-comments');

    expect(listChildNodeComment.getText()).toEqual('en/New Child List Node at Position 1 Comment');

    const listChildNodePosition = page.getEle('div#lists span.list-node-position');

    expect(listChildNodePosition.getText()).toEqual('1');
  });

  it('should reposition a child node to the end of its siblings', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#lists button.reposition-list-node-to-end');

    button.click();

    const listNodePosition = page.getEle('div#lists span.list-node-position');

    expect(listNodePosition.getText()).toEqual('4');

    const listNodeParentIri = page.getEle('div#lists span.list-node-parent-iri');

    expect(listNodeParentIri.getText()).toEqual('http://rdfh.ch/lists/0001/notUsedList');
  });

  it('should reposition a child node to the end of new parent', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    const button = page.getEle('div#lists button.reposition-list-node-to-end-new-parent');

    button.click();

    const listNodePosition = page.getEle('div#lists span.list-node-position');

    expect(listNodePosition.getText()).toEqual('0');

    const listNodeParentIri = page.getEle('div#lists span.list-node-parent-iri');

    expect(listNodeParentIri.getText()).toEqual('http://rdfh.ch/lists/0001/notUsedList');
  });

  it('should delete a list child and root node', () => {

    page.navigateTo();

    // login
    const loginButton = page.getEle('div section#login button.login');
    loginButton.click();
    const loginStatus = page.getEle('div section#login span.status');
    expect(loginStatus.getText()).toEqual('logged in');

    let button = page.getEle('div#lists button.delete-list-child-node');

    button.click();

    const listChildren = page.getEle('div#lists span.list-children');

    expect(listChildren.getText()).toEqual('4');

    button = page.getEle('div#lists button.delete-list-root-node');

    button.click();

    const listDeleted = page.getEle('div#lists span.list-node-deleted');

    expect(listDeleted.getText()).toEqual('true');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    }));
  });
});
