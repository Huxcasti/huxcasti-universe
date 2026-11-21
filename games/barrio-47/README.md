# BARRIO 47 · FPS táctil para iPhone

**Estado:** prototipo alfa jugable (primera versión).
**Enlace:** https://huxcasti.com/games/barrio-47/

Un mapa de entrenamiento 3D original de Huxcasti Games, con estilo arcade y controles móviles. Está inspirado en el ritmo de los FPS clásicos de mapas pequeños, pero no reproduce el mapa Nuketown ni utiliza recursos de Call of Duty.

## Cómo jugar
1. Abrir el enlace desde Safari en iPhone, preferiblemente horizontal.
2. Presionar **Entrar al mapa**.
3. Mover el joystick izquierdo para caminar.
4. Arrastrar el dedo en el lado derecho para mirar.
5. Presionar **DISPARAR** para practicar con los drones brillantes.
6. **SALTAR** para brincar y **CORRER** para desplazarte más rápido.

En computadora también funcionan las teclas WASD, Shift, espacio y mouse.

## Contenido de la versión inicial
- Casas de dos pisos, con entradas y espacios interiores accesibles en planta baja.
- Calle con transporte y camioneta, garajes, patios, coberturas y cercas.
- Objetivos de entrenamiento que reaparecen y marcador de aciertos.
- Radar 2D con posición del jugador.
- Cámara en primera persona con joystick y apuntado táctiles.
- Escena creada con geometría programática y Babylon.js; no se utilizan modelos 3D de pago.

## Lo que falta
- Enemigos con IA que patrullen y disparen.
- Colisiones y navegación avanzadas.
- Armas y sonidos detallados.
- Menú de partidas, salud y reaparición.
- Multijugador y persistencia de estadísticas.

## Tecnología
- Un solo `index.html` con HTML, CSS y JavaScript.
- Babylon.js se carga desde el CDN oficial: https://cdn.babylonjs.com/babylon.js
- Publicación mediante GitHub Pages con el dominio de Huxcasti.
- Este CDN está pensado para prototipos; para producción sería mejor fijar una versión del motor y servir el paquete desde la propia web.

## Notas
El escenario, los nombres, las casas y la distribución son diseños originales de demostración. La primera versión no garantiza el mismo rendimiento en todos los iPhone; funciona en navegadores con WebGL activo y acceso al CDN.
