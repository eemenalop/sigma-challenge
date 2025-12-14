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
docker run -p 3000:3000 sigma-challenge
```

3. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

## Funcionalidades

- Listar productos con paginación
- Buscar productos
- Filtrar por categorías
- Crear productos
- Actualizar productos
- Eliminar productos
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
- Headless UI
- Heroicons

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
- El archivo `data/products.json` está excluido de Git
