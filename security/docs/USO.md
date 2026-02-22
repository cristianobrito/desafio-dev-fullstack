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

## pegar os dados de api ou url 
async function getData(): Promise<Lead[]>{
    {/* pegando os dados da api */}
    const res = await fetch('http://localhost:3001/simulacoes', { cache: 'no-store' });

    {/* se a resposta não for ok */}
    if(!res.ok){
      throw new Error('Falha ao buscar simulações');
    }

    {/* espera converter o formato em json  */}
    const data = await res.json();
    { /* retorna os dados em um array json  */}
    return data;
}

## esperar os dados chegarem

export default async function DomingoP(){
    {/* esperando os dados estarem completos para usar */}
    const data = await getData();
    return(
        <div className="container mx-auto p-4">
          {/* passa os dados para o componente grafico */}
          <DomingoPage data={data} />
        </div>
    )
}

