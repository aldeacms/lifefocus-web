// directus.js
import { createDirectus, rest, readItems, readItem } from '@directus/sdk';

/**
 * Cliente global de Directus usando el SDK oficial.
 * 
 * IDEALMENTE: Mueve la URL a un archivo .env en la raíz del proyecto.
 * Ejemplo en .env:
 * PUBLIC_DIRECTUS_URL="https://admin.lifefocus.agency"
 */

const getDirectusUrl = () => {
    // Si tienes import.meta.env en Astro para variables de entorno:
    return import.meta.env.PUBLIC_DIRECTUS_URL || 'https://admin.lifefocus.agency';
};

const directus = createDirectus(getDirectusUrl()).with(rest());

/**
 * Helper Funcions (Opcionales) para facilitar fetch operations en los componentes.
 */

export const getColeccionItems = async (collectionName, query = {}) => {
    try {
        const data = await directus.request(readItems(collectionName, query));
        return data;
    } catch (error) {
        console.error(`Error fetching collection ${collectionName}:`, error);
        return [];
    }
};

export const getSingleItem = async (collectionName, id, query = {}) => {
    try {
        const item = await directus.request(readItem(collectionName, id, query));
        return item;
    } catch (error) {
        console.error(`Error fetching item ${id} from ${collectionName}:`, error);
        return null;
    }
};

export default directus;
