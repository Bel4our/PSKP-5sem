let sum = (x, y) => {
    return x+y
}

fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки JSON');
            return response.json();
        })
        .then(data => {
            document.getElementById('json-result').textContent = JSON.stringify(data, null, 2);
        })
        .catch(err => {
            document.getElementById('json-result').textContent = err;
        });

    fetch('data.xml')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки XML');
            return response.text(); 
        })
        .then(xmlText => {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(xmlText, "application/xml");
            
            let person = xmlDoc.getElementsByTagName("person")[0];
            let output = `
            Имя: ${person.getElementsByTagName("name")[0].textContent}
            Возраст: ${person.getElementsByTagName("age")[0].textContent}`;
            
            document.getElementById('xml-result').textContent = output;
        })
        .catch(err => {
            document.getElementById('xml-result').textContent = err;
        });
