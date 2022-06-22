const inquirer = require('inquirer')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require("mongodb").ObjectId

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const dbName = "contacts";
client.connect()

// Criar contactos
async function createContact(collectionDocument)
{
    const questions = [
        {
            type: "input",
            name: "name",
            message: "Type a name of contact"
        },
        {
            type: "input",
            name: "number",
            message: "Type a number of contact"
        }
    ]

    const {name, number} = await inquirer.prompt(questions);
    
    const database = client.db(dbName)
    const result = await database.collection(collectionDocument).insertOne({name:name, number:number});
    console.log(result)

    options();
}

// Apagar contactos
async function removeContacts(collectionDocument){
    const question = [
        {
            type: "input",
            name: "contactId",
            message: "Type a contact id to remove"
        }
    ]
    
    const {contactId} = await inquirer.prompt(question)
    const database = client.db(dbName)
    const result = await database.collection(collectionDocument).deleteOne({_id: new ObjectId(contactId)});
    console.log(result)

    options()
}

//Listar contactos
async function listContacts(collectionDocument){
    const database = client.db(dbName)
   
    const documents = await database.collection(collectionDocument).find().toArray()
    console.table(documents, ['_id', 'name'])

    options()   
}

function options(){
    const questions = [
        {
            type: "input",
            name: "contactDocument",
            message: "Type a contact list"
        },
        {
            type: "rawlist",
            name: "action",
            message: "Choose an action",
            choices: ["List Contacts", "Create Contact", "Remove Contact", "Exit"]
        }
    ]

    inquirer.prompt(questions).then(function (answers){
        const contactDocument = answers.contactDocument
        const action = answers.action

        switch(action){
            case "List Contacts":
                listContacts(contactDocument)
                break;
            case "Create Contact":
                createContact(contactDocument)
                break;
            case "Remove Contact":
                removeContacts(contactDocument)
                break;
            case "Exit":
                process.exit()
            default:
                options()
        }
    })
}

options()