
function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
    const searchResults = searchPeopleDataSet(people);

    if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
    else {
        alert('No one was found in the search.');
    }
}

function searchPeopleDataSet(people) {

    const searchTypeChoice = validatedPrompt(
        'Please enter in what type of search you would like to perform.',
        ['id', 'name', 'traits', 'multiple traits']
    );

    let results = [];
    switch (searchTypeChoice) {
        case 'id':
            results = searchById(people);
            break;
        case 'name':
            results = searchByName(people);
            break;
        case 'traits':
            //! TODO
            results = searchByTraits(people);
            break;
        case 'multiple traits':
            results = searchByMultipleTraits(people);
            break;
        default:
            return searchPeopleDataSet(people);
    }

    return results;
}

function searchById(people) {
    const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the the first name of the person you are searching for.');
    const lastNameToSearchFor = prompt('Please enter the the last name of the person you are searching for.');
    const fullNameSearchResults = people.filter(person => (person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() && person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()));
    return fullNameSearchResults;
}

function searchByTraits(people) {
    const traitToSearchFor = prompt('Please enter the trait you want to search for.').toLowerCase();
    const traitFilterResults = people.filter(person => personTraitsMatch(person, traitToSearchFor));
    return traitFilterResults;
    };

function personTraitsMatch(person, trait) {
    return person.traits.includes(trait);
}
function searchByMultipleTraits(people) {
        const multipleTraitsToSearchFor = []
        const maxTraits = 5;

        while (multipleTraitsToSearchFor.length < maxTraits) {
            const trait = validatedPrompt(`Please enter trait #${multipleTraitsToSearchFor.length + 1} or press Enter when done:`, ['']); 
            if (!trait) {
                break;
            }
            multipleTraitsToSearchFor.push(trait.toLowerCase());
        }
    
        if (multipleTraitsToSearchFor.length === 0) {
            alert('No traits entered. Returning all people.');
            return people;
        }
    
        const results = people.filter(person => {
            return multipleTraitsToSearchFor.every(trait => {
                if (trait) {
                    return personTraitsMatch(person, trait);
                }
                return true; 
            });
        });
    
        if (results.length === 0) {
            alert('No matching people found.');
        }
    
        return results;
    } 
function mainMenu(person, people) {

    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
        ['info', 'family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            //! TODO
            displayPersonInfo(person);
            break;
        case "family":
            //! TODO
            let personFamily = findPersonFamily(person, people);
            displayFamily('Family', personFamily);
            break;
        case "descendants":
            //! TODO
            const personDescendants = findDescendantsRecursive(person, people);
            displayDescendants('Descendants', personDescendants);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }

    return mainMenu(person, people);
}

function displayPersonInfo(person) {
    const {firstName, lastName, id, gender, dob, height, weight, eyeColor, occupation, parents, currentSpouse} = person; 
    const info = `Full Name: ${firstName} ${lastName}, ID: ${id},Gender: ${gender},Date of Birth: ${dob},Height: ${height} inches,Weight: ${weight} pounds,Eye Color: ${eyeColor},Occupation: ${occupation},Parents: ${parents.length > 0 ? parents.join(', '): 'N/A'}, Current Spouse: ${currentSpouse ? currentSpouse : 'N/A'}
    `;
    alert(`Person Information:\n\n${info}`)

}
function findPersonFamily(person, people) {
    const { id } = person;
    const family = [];

    const spouse = people.find(p => p.id === person.currentSpouse);
    if (spouse) {
        family.push({ name: `${spouse.firstName} ${spouse.lastName}`, relation: 'Spouse' });
    }

    if (person.parents.length > 0) {
        person.parents.forEach(parentId => {
            const parent = people.find(p => p.id === parentId);
            if (parent) {
                family.push({ name: `${parent.firstName} ${parent.lastName}`, relation: 'Parent' });
            }
        });
    }
    people.forEach(sibling => {
        if (sibling.id !== id && sibling.parents.some(parentId => person.parents.includes(parentId))) {
            family.push({ name: `${sibling.firstName} ${sibling.lastName}`, relation: 'Sibling' });
        }
    });

    return family;
}

function displayFamily(title, family) {
    if (family.length > 0) {
      const familyInfo = family.map(member => `${member.relation}: ${member.name}`).join('\n');
      alert (`${title}: \n\n${familyInfo}`);
    } else {
      alert('No family members found.');
    }
}

function findPersonDescendants(person, people) {
    const descendants = [];

    function findDescendantsRecursive(currentPerson) {
    const children = people.filter(child => child.parents.includes(currentPerson.id));
    for (const child of children) {
        descendants.push(child);
        findDescendantsRecursive(child);
    }
    }    
    if (person){
    findDescendantsRecursive(person);
    }

    return descendants;
}

function displayDescendants(title, descendants) {
    if (descendants.lenght > 0) {
        const descendantsInfo = descendants.map(member => `${member.firstName} ${member.lastName}`).join('\n');
        alert(`${title}:\n\n${descendantsInfo}`);
    } else {
        alert('No descendants found.')
    }
}

function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);
        default:
            alert('Invalid input. Please try again.');
            return exitOrRestart(people);
    }

}