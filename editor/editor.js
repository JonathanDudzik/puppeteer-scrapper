document.addEventListener('click', (e) => {
    var target = e.target 

    console.log('you clicked', target);
//  target.styles = "background: red;"
    const choice = prompt("do you want to add an ACTION or EDIT the element?").toUpperCase()  

    switch (choice) {
      case 'ACTION':
        console.log('You chose ACTION!');
        break;
      case 'EDIT':
        console.log('You chose to EDIT:', target);
        if (target.textContent) {
            target.textContent = "you have EDITED a text"
        } else if (target.src) {
            target.textContent = "You have EDITED a src"
        }
        break;
      default:
        console.log(`Please choose either ACTION or EDIT`);
    };
 })