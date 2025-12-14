# Sigma Challenge - Product Management

Sistema de gestión de productos desarrollado con Next.js 15, TypeScript y Tailwind CSS.

## Requisitos Previos

- Node.js 20 o superior
- npm
- Docker (opcional)

## Instalación y Ejecución

### Clonar el Repositorio

```bash
git clone https://github.com/eemenalop/sigma-challenge.git
cd sigma-challenge
```

### Modo Desarrollo

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

3. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

### Con Docker

1. Construir la imagen:
```bash
docker build -t sigma-challenge .
```

2. Ejecutar el contenedor:
```bash
docker run --name sigma-challenge-app -p 3000:3000 sigma-challenge
```

3. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

## Funcionalidades

- Listar productos con paginación
<img width="1381" height="778" alt="image" src="https://github.com/user-attachments/assets/840954c0-34b9-4194-85bf-eece6c13e83b" />
<img width="1289" height="538" alt="image" src="https://github.com/user-attachments/assets/c6d84da5-7423-424a-bc5c-521c0faecc20" />

- Buscar productos por referencia
  <img width="1191" height="752" alt="image" src="https://github.com/user-attachments/assets/8ff5ace8-7d96-4297-80fe-2d2d499324a1" />


- Filtrar por categorías
  <img width="1289" height="748" alt="image" src="https://github.com/user-attachments/assets/1eea1969-7833-4317-a59f-49140420e1d7" />

- Crear productos
  
  <img width="593" height="783" alt="image" src="https://github.com/user-attachments/assets/c2d26170-ecaf-41f2-a3fc-9a3fc441d2a8" />

- Actualizar productos
  <img width="877" height="741" alt="image" src="https://github.com/user-attachments/assets/5c7989e4-eb94-4144-8456-9d418b3c9738" />
  <img width="863" height="757" alt="image" src="https://github.com/user-attachments/assets/373b2379-32e0-49e7-88c4-6630f3ec58e9" />


- Eliminar productos
  <img width="866" height="732" alt="image" src="https://github.com/user-attachments/assets/434cf0d8-0f21-4764-8ef2-8724ebe2a85d" />


- Persistencia de datos en archivo JSON

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/              # API Routes
│   ├── components/       # Componentes React
│   ├── contexts/         # Context API
│   └── products/         # Páginas de productos
├── lib/
│   ├── services/         # Lógica de negocio
│   ├── validators/       # Validaciones
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilidades
│   └── storage/          # Almacenamiento en memoria
```

## Tecnologías Utilizadas

- Next.js 15
- TypeScript
- Tailwind CSS

## API Endpoints

- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PATCH /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/:id` - Obtener producto por ID
- `GET /api/products/search` - Buscar productos
- `GET /api/products/categories` - Listar categorías
- `GET /api/products/category/:name` - Productos por categoría

## Notas

- Los datos se persisten en `data/products.json`
- La primera vez se cargan automáticamente desde DummyJSON API
- El archivo `data/products.json` está excluido de Git para que la data sea unica y nueva.
