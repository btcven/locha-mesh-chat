# Contributing to Locha Mesh Chat

Thank you for taking the time to contribute!

The following is a set of guidelines to contribute to [** Locha Mesh Chat**]()

#### Table of Contents

- [Contributing to Locha Mesh Chat](#contributing-to-turpial-firmware)
 - [Table of Contents](#table-of-Contents)
  - [Before starting](#before-starting)
  - [How can I contribute?](#how-can-i-contribute?)
    - [I have a question](#tengo-una-pregunta)
    - [Suggestions for improvements](#sugerencia-de-mejoras)
    - [Reporting a bug](#reportando-un-bug)
  - [How to make a Pull Request](#como-hacer-un-pull-request)
    - [Start a new change](#empezar-un-nuevo-cambio)
    - [Upload your changes and make Pull Request](#subir-tus-cambios-y-hacer-pull-request)

## Antes de empezar 
Please read our [code of conduct](CODE_OF_CONDUCT.md)

## Como puedo contribuir?
Nos encantaría aceptar sus parches y contribuciones a este proyecto. Solo hay algunas pautas pequeñas que debes seguir.

### Tengo una pregunta
Para alguna pregunta o duda puede escribirnos via Twitter @Locha_io 
a traves del formulario que encontrara en nuestro sitio web **locha.io**

### Sugerencia de mejoras
ToDo

### Reportando un bug

Puedes abrir un nuevo issue o bug desde una linea o lineas especificas de codigo en un archivo o pull request.

Cuando abrimos un issue o bug desde el codigo , el issue contiene una linea o porcion de codigo que usted seleccione.

Para hacer esto tan solo debera seguir estos pasos:

1. Dentro de GitHub ir hasta la paguina principal del proyecto
2. abrir el branch y archivo al que quiere hacer referencia 
3. para referenciar la linea o lineas de codigo tan solo mantenga presionada la tecla ctrl + click en la linea que desea seleccionar.
4. Cuando termine de seleccionar el codigo que quiere referenciar, click sobre cualquier numero de linea, lo que hara visible un menu de tres puntos, luego seleccionamos referenciar en una nueva issue
5. Le asignamos un titulo al issue y hacemos submit al issue.


## Como hacer un Pull Request

Para cada Pull Request que vayas a realizar tienes que hacer lo siguiente.
### Empezar un nuevo cambio
Antes de empezar a hacer modificaciones ejecuta estos comandos para crear una nueva rama que esté sincronizada con dev:

    git fetch --all # descarga los branch en el repositorio.
    git checkout dev # te cambia a la rama dev en caso de no estar en ella.
    git pull origin dev # para sincronizar el branch dev en local.
    git checkout -b nombredelfeaturequequiereshacer # crea una branch nueva sincronizada con dev.
    git push pr nombredelfeaturequequiereshacer # avienta tu cambio a GitHub

hacer algunos cambios

### Subir tus cambios y hacer Pull Request
Una vez que hiciste los cambios que quieres proponer, realiza los siguientes pasos:
    
    git add .
    git commit -m "Aqui una descripcion de tus cambios".
