import { useState, useRef, memo, useMemo } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import {
  Points,
  PointMaterial,
  Html,
  OrbitControls,
  Text,
  Billboard,
  Plane,
  MapControls,
  Tube,
  Text3D,
} from "@react-three/drei";
import { inSphere } from "maath/random";
import { Curve, LineCurve3, Vector3 } from "three";
import { motion, Variants, Transition } from "framer-motion";

function Dodecahedron({ time, ...props }) {
  return (
    <mesh {...props}>
      <dodecahedronGeometry />
      <meshStandardMaterial roughness={0.75} emissive="#404057" />
      <Html distanceFactor={10}>
        <div class="content">
          hello <br />
          world
        </div>
      </Html>
    </mesh>
  );
}

function Content() {
  const ref = useRef();
  useFrame(
    () =>
      (ref.current.rotation.x =
        ref.current.rotation.y =
        ref.current.rotation.z +=
          0.0)
  );
  return (
    <group ref={ref}>
      <Dodecahedron position={[-2, 0, 0]} />
      <Dodecahedron position={[0, -2, -3]} />
      <Dodecahedron position={[2, 0, 0]} />
    </group>
  );
}

function Overlay() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    >
      <a
        href="https://pmnd.rs/"
        style={{ position: "absolute", bottom: 40, left: 90, fontSize: "13px" }}
      >
        pmnd.rs
        <br />
        dev collective
      </a>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate3d(-50%,-50%,0)",
        }}
      >
        <h1
          style={{
            margin: 0,
            padding: 0,
            fontSize: "15em",
            fontWeight: 500,
            letterSpacing: "-0.05em",
          }}
        >
          hello
        </h1>
      </div>
      <div
        style={{ position: "absolute", top: 40, left: 40, fontSize: "13px" }}
      >
        pretty bad —
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          fontSize: "13px",
        }}
      >
        25/02/2022
      </div>
    </div>
  );
}

function Stars(props) {
  const ref = useRef();
  const [sphere] = useState(() =>
    inSphere(new Float32Array(2000), { radius: 1.5 })
  );
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#ffa0e0"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

const width = 3.7;

function Caption({ children, position = [0, -2, 0], widthDivider = 5.5 }) {
  // const { width } = useThree((state) => state.viewport);
  return (
    <Text
      position={position}
      lineHeight={0.8}
      font="/Ki-Medium.ttf"
      fontSize={width / widthDivider}
      material-toneMapped={false}
      anchorX="center"
      anchorY="middle"
    >
      {children}
    </Text>
  );
}

function SubCaption({ children, position = [0, -2.7, 0] }) {
  return (
    <Text
      position={position}
      lineHeight={0.8}
      // font="/Ki-Medium.ttf"
      fontSize={width / 8}
      material-toneMapped={false}
      anchorX="center"
      anchorY="middle"
      color="#f7f7f7"
    >
      {children}
    </Text>
  );
}

function Alternative({ title, cap, raised, vPosition = 0, anchorX = "right" }) {
  return (
    <>
      <Text
        position={[anchorX === "right" ? 2.15 : -1.65, 0.1 + vPosition, 0]}
        lineHeight={0.8}
        // font="/Ki-Medium.ttf"
        fontSize={width / 9}
        material-toneMapped={false}
        anchorX={anchorX}
        anchorY="middle"
        color="#eff6ff"
        // font="https://fonts.gstatic.com/s/raleway/v13/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        {title}
      </Text>
      <Text
        position={[anchorX === "right" ? 2.15 : -1.65, -0.5 + vPosition, 0]}
        lineHeight={0.8}
        font="/Ki-Medium.ttf"
        fontSize={width / 11}
        material-toneMapped={false}
        anchorX={anchorX}
        anchorY="middle"
        color="#818cf8"
      >
        {raised}
      </Text>
      <Text
        position={[anchorX === "right" ? 2.15 : -1.65, -0.9 + vPosition, 0]}
        lineHeight={0.8}
        // font="/Ki-Medium.ttf"
        fontSize={width / 15}
        material-toneMapped={false}
        anchorX={anchorX}
        anchorY="middle"
        color="#94a3b8"
      >
        FUNDS RAISED
      </Text>
      <Text
        position={[anchorX === "right" ? 0.15 : 0.4, -0.5 + vPosition, 0]}
        lineHeight={0.8}
        font="/Ki-Medium.ttf"
        fontSize={width / 11}
        material-toneMapped={false}
        anchorX={anchorX}
        anchorY="middle"
        color="#4ade80"
      >
        {cap}
      </Text>
      <Text
        position={[anchorX === "right" ? 0.15 : 0.4, -0.9 + vPosition, 0]}
        lineHeight={0.8}
        // font="/Ki-Medium.ttf"
        fontSize={width / 15}
        material-toneMapped={false}
        anchorX={anchorX}
        anchorY="middle"
        color="#94a3b8"
      >
        MARKET CAP
      </Text>
    </>
  );
}

function Marker({ children, ...props }) {
  // This holds the local occluded state
  const [occluded, occlude] = useState();
  return (
    <Html
      // 3D-transform contents
      transform
      // Hide contents "behind" other meshes
      occlude
      // Tells us when contents are occluded (or not)
      onOcclude={occlude}
      // We just interpolate the visible state into css opacity and transforms
      style={{
        transition: "all 0.2s",
        opacity: occluded ? 0 : 1,
        transform: `scale(${occluded ? 0.5 : 1})`,
      }}
      {...props}
    >
      {children}
    </Html>
  );
}

export default function IndexPage() {
  const line = useMemo(() => {
    const v1 = new Vector3(0, 0, -0.35);
    const v2 = new Vector3(0, 0, 0.35);
    return new LineCurve3(v1, v2);
  }, []);

  // const MPs = {
  //   marketplace: {
  //     value:
  //   }
  // }

  return (
    <>
      {/* <Overlay /> */}
      <Canvas camera={{ position: [0, 0, 2] }}>
        <mesh position={[0, 1.2, 0]} scale=".1">
          <Caption widthDivider={4}>
            The path to an open-source marketplace...
          </Caption>
          <Text font="/Ki-Medium.ttf" fontSize={0.5} position={[0, -3.4, 0]}>
            We're standardizing the marketplace and then building{" "}
          </Text>
          <mesh position={[0.2, -3.3, -3]}>
            <mesh
              position={[-1.1, -0.08, 0]}
              scale="3.2"
              rotation={[1, 0.8, Math.PI / 2]}
            >
              <tetrahedronGeometry args={[0.1, 0]} />
              <meshNormalMaterial />
            </mesh>
            <Text fontSize={0.65}>ONE</Text>
            <Plane args={[0.1, 0.0375]} material-color="#047857" />

            {/* <Text
              position={[1.4, 0, 0.001]}
              lineHeight={0.8}
              font="/Ki-Medium.ttf"
              fontSize={0.3}
              material-toneMapped={false}
              anchorX="center"
              anchorY="middle"
              color="#10b981"
            >
              ALPHA
            </Text> */}

            {/* <Billboard position={[0, 0, 0]}>
              <Plane args={[1.8, 0.9]} material-color="#e2e8f0" />
            </Billboard> */}
            {/* <Billboard position={[0, -0.75, 0]}>
              <Text
                position={[0, 0, 0.001]}
                lineHeight={0.8}
                font="/Ki-Medium.ttf"
                fontSize={0.3}
                material-toneMapped={false}
                anchorX="center"
                anchorY="middle"
                color="#10b981"
              >
                ALPHA
              </Text>
            </Billboard> */}
          </mesh>
        </mesh>
        <mesh position={[0, 0.2, 0]} scale=".1">
          <torusKnotGeometry args={[0.9, 0.25, 256, 2, 6]} />
          <meshNormalMaterial />
          <SubCaption position={[0.1, 3, 0]}>{`fulfillment`}</SubCaption>
          <Caption position={[0.1, 2.2, 0]}>{`openship`}</Caption>
        </mesh>
        <mesh position={[-0.45, 0.395, 0]} scale=".1">
          <Caption
            position={[0.3, 1, 0]}
            widthDivider={8}
          >{`MARKET PLAYERS`}</Caption>
          <Alternative title="Channel Advisor" cap="$654M" raised="$81M" />
          <Alternative
            title="BrightPearl"
            cap="$360M"
            raised="$88M"
            vPosition={-1.8}
          />
        </mesh>
        <Billboard follow={false} position={[0, 0.58, 0]}>
          <Plane args={[0.1, 0.0375]} material-color="#1d4ed8" />
          <Text
            position={[0, 0, 0.001]}
            lineHeight={0.8}
            font="/Ki-Medium.ttf"
            fontSize={width / 150}
            material-toneMapped={false}
            anchorX="center"
            anchorY="middle"
            // color="#4c6ef5"
          >
            V 2.0
          </Text>
        </Billboard>
        <mesh position={[-0.6, -0.6, 0]} scale=".1">
          <torusGeometry args={[1, 0.25, 2, 100]} />
          <meshNormalMaterial />
          <SubCaption>{`sales`}</SubCaption>
          <Caption>{`openfront`}</Caption>
        </mesh>
        <mesh position={[-1.1, -0.6, 0]} scale=".1">
          <Caption
            position={[0.3, 1, 0]}
            widthDivider={8}
          >{`MARKET PLAYERS`}</Caption>
          <Alternative title="Shopify" cap="$39B" raised="$122M" />
          <Alternative
            title="BigCommerce"
            cap="$1B"
            raised="$224M"
            vPosition={-1.8}
          />
        </mesh>
        <Billboard follow={false} position={[-0.6, -0.95, 0]}>
          <Plane args={[0.1, 0.0375]} material-color="#047857" />
          <Text
            position={[0, 0, 0.001]}
            lineHeight={0.8}
            font="/Ki-Medium.ttf"
            fontSize={width / 150}
            material-toneMapped={false}
            anchorX="center"
            anchorY="middle"
            // color="#4c6ef5"
          >
            ALPHA
          </Text>
        </Billboard>
        <mesh position={[0.6, -0.6, 0]} scale=".1">
          <torusKnotGeometry args={[0.9, 0.25, 256, 2, 3, 1]} />
          {/* <sphereGeometry args={[1, 64, 64]} /> */}
          <meshNormalMaterial />
          <SubCaption>{`support`}</SubCaption>
          <Caption>{`opensupport`}</Caption>
        </mesh>
        <mesh position={[1.1, -0.6, 0]} scale=".1">
          <Caption
            position={[0.3, 1, 0]}
            widthDivider={8}
          >{`MARKET PLAYERS`}</Caption>
          <Alternative
            title="Zendesk"
            cap="$9.5B"
            raised="$86M"
            anchorX="left"
          />
          <Alternative
            title="Gorgias"
            cap="$710M"
            raised="$73M"
            anchorX="left"
            vPosition={-1.8}
          />
        </mesh>
        <Billboard follow={false} position={[0.6, -0.95, 0]}>
          <Plane args={[0.1, 0.0375]} material-color="#047857" />
          <Text
            position={[0, 0, 0.001]}
            lineHeight={0.8}
            font="/Ki-Medium.ttf"
            fontSize={width / 150}
            material-toneMapped={false}
            anchorX="center"
            anchorY="middle"
            // color="#4c6ef5"
          >
            ALPHA
          </Text>
        </Billboard>
        <mesh position={[0, -0.375, 0]}>
          <Text
            position={[0, 0.25, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            fontSize={0.035}
            color="#ffffff"
            font="/Ki-Medium.ttf"
          >
            Orders API
          </Text>
          <Text
            position={[0.25, -0.12, 0]}
            rotation={[0, 0, -Math.PI / 7]}
            fontSize={0.035}
            color="#ffffff"
            font="/Ki-Medium.ttf"
          >
            Messages API
          </Text>
          <Text
            position={[-0.25, -0.12, 0]}
            rotation={[0, 0, Math.PI / 7]}
            fontSize={0.035}
            color="#ffffff"
            font="/Ki-Medium.ttf"
          >
            Products API
          </Text>
          {/* <mesh scale="1" rotation={[0, 0, 2]} position={[-0.23, -0.11, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.55, 3]} />
            <meshNormalMaterial />
          </mesh> */}
          {/* <sphereGeometry args={[0.075, 64, 64]} /> */}
          <mesh scale="1" rotation={[0.5, 0.8, Math.PI / 2]}>
            <tetrahedronGeometry args={[0.1, 0]} />
            <meshNormalMaterial />
          </mesh>
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.03}
            color="#94a3b8"
            font="/Ki-Medium.ttf"
            // font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          >
            ONE
            {/* <meshNormalMaterial /> */}
            {/* <meshNormalMaterial /> */}
          </Text>
          {/* <Billboard follow={false} position={[0, -0.18, 0]}>
            <Plane args={[0.15, 0.0575]} material-color="#075985" />
            <Text
              position={[0, 0, 0.001]}
              lineHeight={0.8}
              font="/Ki-Medium.ttf"
              fontSize={width / 100}
              material-toneMapped={false}
              anchorX="center"
              anchorY="middle"
              // color="#4c6ef5"
            >
              SWAP
            </Text>
          </Billboard> */}
          {/* <mesh scale="0" rotation={[0, 0, 0]} position={[0, -0.1, 0]}>
            <motion.button style={{ fontSize: "1px" }}>SWAP</motion.button>
          </mesh> */}
          <mesh scale="1" rotation={[0, 0, 0]} position={[0, -0.35, 0]}>
            {/* <ringGeometry args={[ 1, 1, 2 ]} /> */}
            <coneGeometry args={[0.07, 0.12, 32]} />
            <meshNormalMaterial />
            {/* <sphereGeometry args={[0.075, 64, 64]} /> <meshNormalMaterial /> */}
          </mesh>
          <Text
            position={[0, -0.48, 0]}
            fontSize={0.03}
            color="#94a3b8"
            font="/Ki-Medium.ttf"
            // font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          >
            AMAZON
            {/* <meshNormalMaterial /> */}
            {/* <meshNormalMaterial /> */}
          </Text>
          <Text
            position={[0, -0.53, 0]}
            lineHeight={0.8}
            font="/Ki-Medium.ttf"
            fontSize={0.03}
            anchorY="middle"
            color="#4ade80"
          >
            $1.2T
          </Text>
          <mesh scale="1" rotation={[-2, 0, 0]} position={[0, -0.7, 0]}>
            {/* <boxGeometry args={[0.1, 0.09, 0.1]} /> */}
            <octahedronGeometry args={[0.07, 0]} />
            <meshNormalMaterial />
          </mesh>
          <Text
            position={[0, -0.83, 0]}
            fontSize={0.03}
            color="#94a3b8"
            font="/Ki-Medium.ttf"
            // font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          >
            AIRBNB
            {/* <meshNormalMaterial /> */}
            {/* <meshNormalMaterial /> */}
          </Text>
          <Text
            position={[0, -0.88, 0]}
            lineHeight={0.8}
            font="/Ki-Medium.ttf"
            fontSize={0.03}
            anchorY="middle"
            color="#4ade80"
          >
            $67.2B
          </Text>
        </mesh>
        <MapControls />
        <Stars />
      </Canvas>
      <div style={{ position: "absolute", bottom: 0, right: 10, color: "white" }}>
        <a
          href="https://github.com/openshiporg/vision"
          title="GitHub"
        >
          <svg
            aria-hidden="true"
            height="18"
            width="18"
            version="1.1"
            viewBox="0 0 16 16"
            color="white"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
        </a>
      </div>
    </>
  );
}
