
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
        ['id', 'name', 'traits']
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
    
function mainMenu(person, people) {

    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
        ['info', 'family', 'immediate family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            //! TODO
            displayPersonInfo(person);
            break;
        case "family":
            //! TODO
            // let personFamily = findPersonFamily(person, people);
            // displayPeople('Family', personFamily);
            break;
        case "immediate family":
            displayImmediateFamily(person, people);
            break;
        case "descendants":
            //! TODO
            let personDescendants = findPersonDescendants(person, people);
            displayPeople('Descendants', personDescendants);
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
function displayImmediateFamily(person, people) {
    const { id, firstName, lastName} = person;
    const immediateFamily = [];
    const spouse = people.find(p => p.id === person.currentSpouse);
    if (spouse) {
        immediateFamily.push({ name: `${spouse.firstName} ${spouse.lastName}`, relation: 'Spouse'});
    }
    if (person.parents.length > 0) {
        person.parents.forEach(parentId => {
            const parent = people.find(p => p.id === parentId);
            if (parent) {
                immediateFamily.push({ name: `${parent.firstName} ${parent.lastName}`, relation: 'Parent' });
            }
        });
    }
    people.forEach(sibling => {
        if (sibling.id !== id && sibling.parents.some(parentId => person.parents.includes(parentId))) {
            immediateFamily.push({ name: `${sibling.firstName} ${sibling.lastName}`, relation: 'Sibling' });
        }
    });
    if (immediateFamily.length > 0) {
        const familyInfo = immediateFamily.map(member => `${member.relation}: ${member.name}`).join('\n');
        alert(`Immediate Family of ${firstName} ${lastName}:\n\n${familyInfo}`);
    } else {
        alert(`${firstName} ${lastName} has no immediate family members recorded.`);
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