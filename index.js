const express = require("express")
const fs = require('node:fs')
const dbFile = 'data.json'
const server = express()
server.use(express.json())


function existData(){
    
    if (fs.existsSync(dbFile) == true) {
        return true
    }else{
        return false
    }

}

function updateData(data) {
    //el objeto creado con la nueva info y parseado a string 
    const newData = JSON.stringify({ koders: data })
    //Re escribiendo el archivo ya con las actualizaciones
    fs.writeFileSync(dbFile, newData)
}

function crearData() {

    //se valida si existe el archivo
    const fileExists = fs.existsSync(dbFile)

    //si no existe el archivo dbFile entonces lo crea y le añade el objeto koders con valor de una lista vacía
    if (!fileExists) {
        fs.writeFileSync(dbFile, JSON.stringify({ koders: [] }))
    }

}

function getData() {
    //Se crea una variable igualada a los datos del archivo 
    const content = fs.readFileSync(dbFile, 'utf-8')
    //como resultado retornamos la lista que trae el objeto koders
    return JSON.parse(content).koders
}

function rm(index) {

    const koders = getData()
    //se procede a eliminar el koder
    koders.splice(index, 1)

    //actualizar el archivo (con el elemento de la lista eliminado)
    updateData(koders)
}

function add(koderName,koderGen,koderGender, koderAge, koderIsActive){
    //Llamamos la lista con getData() 
    const data = getData()
    //añadimos a la lista el koder (argumento) ingresado por el usuario 
    const koderObj ={
        name : koderName,
        generation : koderGen,
        gender : koderGender,
        age : koderAge,
        isActive : koderIsActive
    }
    data.push(koderObj)
    //actualizamos la lista con la data actual 
    updateData(data)

}

server.get('/koders',(req,res)=>{

    if(existData()){
        res.status(200)
        res.json({
            message:'All Koders',
            koders: getData()
        })
    }else{
        res.status(400)
        res.json({
            message:'File not exists you have to post a koder to create DB '
        })
    }
    
})

server.listen(8080,()=>{
    console.log(('Server running on port 8080'))
})

server.post('/koders',(req,res)=>{

    function esString(str) {
        return typeof str === 'string';
    }
    function esNumero(valor) {
        return typeof valor === 'number' && !isNaN(valor);
      }
    function esBooleano(valor) {
       return typeof valor === 'boolean';
    }

    crearData()
    const koderName= req.body.koderName
    const koderGen=req.body.koderGen
    const koderGender=req.body.koderGender
    const koderAge=req.body.koderAge
    const koderIsActive=req.body.koderIsActive

    //si no hay todo entonces se pone un status de 404 y se manda el mensaje de:  todo is required
    if(!koderName || !koderGen || !koderAge || !koderGender || !koderIsActive){
        res.status(400)
        res.json({
            message:'koder data is required'
        })
        //si no se agrega el return entonces no se va a detener y de todas formas se va a agregar el todo vacío
        return
    }
    if(esString(koderName) && esString(koderGender) && esNumero(koderGen) && esNumero(koderAge) && esBooleano(koderIsActive)){
        add(koderName,koderGen,koderGender,koderAge,koderIsActive)
        res.json({
            message:'new Koder added',
            koders: getData()
        })
        return
    }else{
        res.status(400)
        res.json({
            message:'koder data is wrong type, have to check your data'
        })
    }



})

server.delete('/koders/:name',(req,res)=>{

    const koders = getData()
    const name = req.params.name
    
    const minName = name.toLowerCase

    let indice = koders.findIndex(koder => koder.name.toLowerCase == minName )


    if(indice=== -1) {
        res.status(404).json({ message: 'Koder no encontrado' });
        return;
    }

    rm(indice)

    res.json({
        message:'Koder deleted successfully',
        koders: getData()
    })
    
})

server.delete('/koders/',(req,res)=>{
   
    updateData([])

    res.json({
        message:'Koder deleted successfully',
        koders: getData()
    })
    
})