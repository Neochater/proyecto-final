#!/bin/bash

# Script de utilidad para el proyecto GameVault

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para verificar dependencias
check_dependencies() {
    echo -e "${YELLOW}Verificando dependencias...${NC}"
    
    # Lista de programas requeridos
    DEPS=("php" "mysql" "node" "npm")
    
    for dep in "${DEPS[@]}"; do
        if ! command -v $dep &> /dev/null; then
            echo -e "${RED}Error: $dep no está instalado${NC}"
            exit 1
        fi
    done
    
    echo -e "${GREEN}Todas las dependencias están instaladas${NC}"
}

# Función para iniciar el servidor de desarrollo
start_dev_server() {
    echo -e "${YELLOW}Iniciando servidor de desarrollo...${NC}"
    php -S localhost:8000
}

# Función para construir el proyecto
build_project() {
    echo -e "${YELLOW}Construyendo el proyecto...${NC}"
    
    # Verificar y crear directorios necesarios
    mkdir -p dist
    
    # Copiar archivos
    cp index.html dist/
    cp styles.css dist/
    cp script.js dist/
    cp favicon.ico dist/
    cp contact.php dist/
    
    echo -e "${GREEN}Proyecto construido exitosamente${NC}"
}

# Función para limpiar archivos temporales
clean_project() {
    echo -e "${YELLOW}Limpiando archivos temporales...${NC}"
    rm -rf dist
    rm -rf node_modules
    rm -f package-lock.json
    echo -e "${GREEN}Limpieza completada${NC}"
}

# Menú principal
case "$1" in
    "check")
        check_dependencies
        ;;
    "start")
        start_dev_server
        ;;
    "build")
        build_project
        ;;
    "clean")
        clean_project
        ;;
    *)
        echo -e "Uso: $0 {check|start|build|clean}"
        exit 1
        ;;
esac

exit 0