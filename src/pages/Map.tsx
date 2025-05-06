import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { ZoomIn, ZoomOut } from "lucide-react";
import { TextureLoader } from "three";
import { IMAGE_PATH } from "@/config";

// Komponent księżyca
const Moon = ({ name, distance, size, color, orbitalSpeed, parentRef }) => {
  const moonRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(
    TextureLoader,
    `${IMAGE_PATH}map_/planet_placeholder.png`
  );

  const handleClick = (e) => {
    e.stopPropagation(); // Zapobiega propagacji zdarzenia do planety
    alert(`Księżyc: ${name}`);
  };

  useFrame(({ clock }) => {
    if (parentRef.current) {
      // Pozycja względem planety
      const time = clock.getElapsedTime() * orbitalSpeed;
      moonRef.current.position.x =
        parentRef.current.position.x + Math.sin(time) * distance;
      moonRef.current.position.z =
        parentRef.current.position.z + Math.cos(time) * distance;
      moonRef.current.position.y = parentRef.current.position.y;

      // Rotacja księżyca wokół własnej osi - stała prędkość rotacji
      // Różne księżyce mają różne prędkości rotacji - mnożymy przez stałą wartość zależną od odległości
      moonRef.current.rotation.y += 0.005 * (1 / (distance * 0.5));
    }
  });

  return (
    <group ref={moonRef}>
      <mesh
        scale={hovered ? 1.1 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} color={color} />
      </mesh>

      <Text
        position={[0, size + 0.3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {name}
      </Text>
    </group>
  );
};

// Poprawiona fizyka - planety krążą wokół gwiazdy
const Planet = ({
  name,
  distance,
  size,
  color = "blue",
  orbitalSpeed,
  onSelect,
  texturePath,
  moons = [],
}) => {
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(
    TextureLoader,
    texturePath || `${IMAGE_PATH}map_/planet_placeholder.png`
  );

  useFrame(({ clock }) => {
    // Animacja orbity - planeta krąży wokół środka (gdzie jest gwiazda)
    const time = clock.getElapsedTime() * orbitalSpeed;
    planetRef.current.position.x = Math.sin(time) * distance;
    planetRef.current.position.z = Math.cos(time) * distance;

    // Rotacja planety wokół własnej osi - prędkość rotacji zależy od odległości
    // Planety bliżej gwiazdy obracają się szybciej (zgodnie z prawami fizyki)
    const rotationSpeed = 0.01 * (10 / distance);
    planetRef.current.rotation.y += rotationSpeed;
  });

  return (
    <group>
      <group ref={planetRef}>
        {/* Planeta */}
        <mesh
          scale={hovered ? 1.1 : 1}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() =>
            onSelect({
              type: "planet",
              name,
              distance,
              size,
              moons: moons.length,
            })
          }
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={texture} color={color} />
        </mesh>

        {/* Etykieta */}
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="black"
        >
          {name}
        </Text>
      </group>

      {/* Księżyce */}
      <Suspense fallback={null}>
        {moons.map((moon, i) => (
          <Moon key={i} {...moon} parentRef={planetRef} />
        ))}
      </Suspense>

      {/* Orbity księżyców - krążą razem z planetą */}
      {moons.map((moon, i) => (
        <mesh key={`moon-orbit-${i}`} position={[0, 0, 0]}>
          <ringGeometry
            args={[moon.distance - 0.05, moon.distance + 0.05, 64]}
          />
          <meshBasicMaterial color="gray" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
};

// Komponent systemu gwiezdnego
const StarSystem = ({ setSelectedObject }) => {
  const starRef = useRef();
  const starTexture = useLoader(
    TextureLoader,
    `${IMAGE_PATH}map_/planet_placeholder.png`
  );

  useFrame(() => {
    // Rotacja gwiazdy wokół własnej osi - powolny obrót
    starRef.current.rotation.y += 0.001;
  });

  // Definicja planet w systemie
  const planets = [
    {
      name: "Proxima b",
      distance: 10,
      size: 0.8,
      color: "lightblue",
      orbitalSpeed: 0.2,
      texturePath: `${IMAGE_PATH}map_/planet_placeholder.png`,
      moons: [
        {
          name: "Proxima b-I",
          distance: 2,
          size: 0.2,
          color: "gray",
          orbitalSpeed: 0.5,
        },
      ],
    },
    {
      name: "Proxima c",
      distance: 15,
      size: 1.2,
      color: "lightgreen",
      orbitalSpeed: 0.1,
      texturePath: `${IMAGE_PATH}map_/planet_placeholder.png`,
      moons: [
        {
          name: "Proxima c-I",
          distance: 2,
          size: 0.3,
          color: "darkgray",
          orbitalSpeed: 0.6,
        },
        {
          name: "Proxima c-II",
          distance: 3,
          size: 0.15,
          color: "lightgray",
          orbitalSpeed: 0.4,
        },
      ],
    },
    {
      name: "Proxima d",
      distance: 20,
      size: 0.6,
      color: "tan",
      orbitalSpeed: 0.05,
      texturePath: `${IMAGE_PATH}map_/planet_placeholder.png`,
      moons: [],
    },
    {
      name: "Proxima e",
      distance: 25,
      size: 1.0,
      color: "palevioletred",
      orbitalSpeed: 0.03,
      texturePath: `${IMAGE_PATH}map_/planet_placeholder.png`,
      moons: [
        {
          name: "Proxima e-I",
          distance: 2.2,
          size: 0.25,
          color: "slategray",
          orbitalSpeed: 0.55,
        },
        {
          name: "Proxima e-II",
          distance: 3.5,
          size: 0.2,
          color: "darkslategray",
          orbitalSpeed: 0.35,
        },
        {
          name: "Proxima e-III",
          distance: 5,
          size: 0.15,
          color: "dimgray",
          orbitalSpeed: 0.25,
        },
      ],
    },
  ];

  // Wyświetlanie orbit
  const renderOrbits = () => {
    return planets.map((planet, i) => (
      <mesh key={`orbit-${i}`} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[planet.distance - 0.1, planet.distance + 0.1, 64]}
        />
        <meshBasicMaterial color="gray" transparent opacity={0.2} />
      </mesh>
    ));
  };

  return (
    <>
      <mesh
        ref={starRef}
        position={[0, 0, 0]}
        onClick={() =>
          setSelectedObject({ type: "star", name: "Proxima Centauri" })
        }
      >
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          map={starTexture}
          color="orange"
          emissive="orange"
          emissiveIntensity={0.5}
        />
        <pointLight intensity={1.5} color="white" />
      </mesh>

      {/* Orbity planet */}
      {renderOrbits()}

      {/* Planety */}
      <Suspense fallback={null}>
        {planets.map((planet, i) => (
          <Planet key={i} {...planet} onSelect={setSelectedObject} />
        ))}
      </Suspense>

      {/* Światło otoczenia */}
      <ambientLight intensity={0.1} />

      {/* Tło gwiazd */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
    </>
  );
};

// Funkcja obsługująca przyciski zoomu
const ZoomControls = ({ zoomIn, zoomOut }) => {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      <button
        className="bg-black/70 backdrop-blur-md p-2 rounded-lg"
        onClick={zoomIn}
      >
        <ZoomIn className="w-6 h-6 text-white" />
      </button>
      <button
        className="bg-black/70 backdrop-blur-md p-2 rounded-lg"
        onClick={zoomOut}
      >
        <ZoomOut className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

// Główny komponent mapy
const MapComponent = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const controlsRef = useRef();

  // Funkcje do obsługi przycisków zoom
  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.5);
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.5);
    }
  };

  return (
    <>
      <div className="h-screen w-full fixed top-0 left-0">
        <Canvas
          camera={{ position: [25, 25, 25], fov: 50 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <StarSystem setSelectedObject={setSelectedObject} />

            {/* Kontrola kamery - niezależna od systemu gwiezdnego */}
            <OrbitControls
              ref={controlsRef}
              enableZoom={true}
              zoomSpeed={0.5}
              minDistance={5}
              maxDistance={100}
              target={[0, 0, 0]} // Celuj w środek układu (gwiazdę)
            />
          </Suspense>
        </Canvas>

        {/* Panel informacyjny - pokazuje szczegóły wybranego obiektu */}
        {selectedObject && (
          <div className="absolute top-20 left-4 bg-black/70 backdrop-blur-md rounded-lg p-6 space-y-4 w-80 text-white">
            <h2 className="text-2xl font-bold">{selectedObject.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Type</p>
                <p className="capitalize">{selectedObject.type}</p>
              </div>
              {selectedObject.type === "star" && (
                <>
                  <div>
                    <p className="text-gray-400">Class</p>
                    <p>Red Dwarf (M5.5Ve)</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Mass</p>
                    <p>0.12 M☉</p>
                  </div>
                  <div>
                    <p className="text-gray-400">System</p>
                    <p>Alpha Centauri</p>
                  </div>
                </>
              )}
              {selectedObject.type === "planet" && (
                <>
                  <div>
                    <p className="text-gray-400">Distance</p>
                    <p>
                      {selectedObject.distance
                        ? `${selectedObject.distance} AU`
                        : "0.05 AU"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Size</p>
                    <p>
                      {selectedObject.size
                        ? `${selectedObject.size.toFixed(1)} Earth radii`
                        : "1.08 Earth radii"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Type</p>
                    <p>Rocky</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Moons</p>
                    <p>
                      {selectedObject.moons !== undefined
                        ? selectedObject.moons
                        : "Unknown"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Kontrola UI - poza Canvas */}
        <ZoomControls zoomIn={handleZoomIn} zoomOut={handleZoomOut} />
      </div>
    </>
  );
};

export default MapComponent;
