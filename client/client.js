const form = document.querySelector("form");
const loadingElement = document.querySelector('.progress');
const oinksElement = document.querySelector('.oinks');
const API_URL = 'http://localhost:5000/oinks';


//hide progress bar when page loads
//loadingElement.style.display = 'none';

listAllOinks();

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get("name");
    const content = formData.get('content');

    const oink = {
        name,
        content
    };

    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        //takes the object 'oink' and turns it into something the server can parse and understand
        body: JSON.stringify(oink), 
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(createdOink => {
        form.reset();
        form.style.display = '';
        listAllOinks();
    }); 
        loadingElement.style.display = 'none';
    });


function listAllOinks() {
    //blank out every other oink and list new ones
    oinksElement.innerHTML = '';
    
    fetch(API_URL)
        .then(response => response.json())
        .then(oinks => {
            console.log(oinks);
            oinks.reverse();
            oinks.forEach(oink => {
                const div = document.createElement('div');
                
                const header = document.createElement('h3');
                header.textContent = oink.name;
                
                const contents = document.createElement('p');
                contents.textContent = oink.content;

                const date = document.createElement('small');
                date.textContent = new Date(oink.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                oinksElement.appendChild(div);
            });
        loadingElement.style.display = 'none';
    });
};
