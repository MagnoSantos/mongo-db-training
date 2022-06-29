// 1. Search for a contact in my contact list
// 2. List all my contacts in alphabetic order
// 3. Create a pagination system that shows all my contacts

//  Marco - 20365353
//  Danilo - 34255342
//  More(y/n) y
//  Tiago - 6452432
//  Aguiar - 436345523

const MongoClient = require("mongodb").MongoClient
const inquirer = require("inquirer")

const url = "mongodb://localhost:27017"
const client = new MongoClient(url)
client.connect()
const database = client.db("contacts")

// List all contacts paginated and ordered
async function listContacts(contactList, limit = 3, skip = 0){
    const documents = await database.collection(contactList)
                                    .find({})
                                    .project({name: 1, number: 1, _id: 0})
                                    .sort({name: 1})
                                    .limit(limit)
                                    .skip(skip)
                                    .toArray()
    console.table(documents)
    const questions = [
        {
            type: "confirm",
            name: "confirmation",
            message: "More (y/n)"
        }
    ]
    const {confirmation} = await inquirer.prompt(questions)
    
    if (confirmation)
        listContacts(contactList, limit, skip + limit)
    else
        options()
}

//Search contact
async function searchContacts(contactList){
    const questions = [
        {
            type: "input",
            name: "nameContact",
            message: "Please type a name of contact: "
        }
    ]
    const { nameContact } = await inquirer.prompt(questions)
    const document = await database.collection(contactList)
                                   .find({name: nameContact})
                                   .project({name: 1, number: 1, _id: 0})
                                   .limit(limit)
                                   .skip(skip)
                                   .toArray()

    console.table(document)
    options()
}

async function options(){

    // Question to be asked to the user
    const questions = [
        {
            type: "input",
            name: "contactList",
            message: "Please type a contact list"
        },
        {
            type: "rawlist",
            name: "action",
            message: "Choose an action",
            choices: ["List Contacts", "Search Contact", "Exit"]
        }
    ]

    // Ask questions to the user
    const answers = await inquirer.prompt(questions)

    const {contactList, action} = answers

    switch(action){
        case "List Contacts":
            // if action == List Contacts
            listContacts(contactList)
            break
        case "Search Contact":
            searchContacts(contactList)
            break
        case "Exit":
            process.exit()
        default:
            // else show interface again
            options()
    }
}

// run interface
options()