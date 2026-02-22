## map()
- cria um novo array como resultado, ele é imutavel

ex1:
const numeros = [1, 2, 3, 4];
const dobro = numeros.map(num => num * 2);

console.log(dobro);    // [2, 4, 6, 8]
console.log(numeros);  // [1, 2, 3, 4] (original intacto)

ex2:
const persons = [
  {firstname : "Malcom", lastname: "Reynolds"},
  {firstname : "Kaylee", lastname: "Frye"},
  {firstname : "Jayne", lastname: "Cobb"}
];

persons.map(getFullName);

function getFullName(item) {
  return [item.firstname,item.lastname].join(" ");
}

