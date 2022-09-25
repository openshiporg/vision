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
} from "@react-three/drei";
import { inSphere } from "maath/random";
import { Curve, LineCurve3, Vector3 } from "three";
import { PlatformButton } from "../components/PlatformButton";

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

export default function IndexPage() {
  const line = useMemo(() => {
    const v1 = new Vector3(0, 0, -0.35);
    const v2 = new Vector3(0, 0, 0.35);
    return new LineCurve3(v1, v2);
  }, []);

  const path = useMemo(() => {
    class CustomSinCurve extends Curve {
      constructor(scale = 1) {
        super();

        this.scale = scale;
      }

      getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;

        return new Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    return new CustomSinCurve(10);
  }, []);

  return (
    <>
      {/* <Overlay /> */}
      <Canvas camera={{ position: [0, 0, 1.5] }}>
        <mesh position={[0, 1, 0]} scale=".1">
          <Caption widthDivider={4}>
            The path to an open-source marketplace...
          </Caption>
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
        <mesh position={[-0.4, -0.4, 0]} scale=".1">
          <torusGeometry args={[1, 0.25, 2, 100]} />
          <meshNormalMaterial />
          <SubCaption>{`sales`}</SubCaption>
          <Caption>{`openfront`}</Caption>
        </mesh>
        <mesh position={[-0.9, -0.4, 0]} scale=".1">
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
        <Billboard follow={false} position={[-0.4, -0.75, 0]}>
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
        <mesh position={[0.4, -0.4, 0]} scale=".1">
          <torusKnotGeometry args={[0.9, 0.25, 256, 2, 3, 1]} />
          {/* <sphereGeometry args={[1, 64, 64]} /> */}
          <meshNormalMaterial />
          <SubCaption>{`support`}</SubCaption>
          <Caption>{`opensupport`}</Caption>
        </mesh>
        <mesh position={[0.9, -0.4, 0]} scale=".1">
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
        <Billboard follow={false} position={[0.4, -0.75, 0]}>
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
        {/* <Billboard follow={false} position={[-0.2, -0.75, 0]}>
          <Plane args={[0.1, 0.0375]} material-color="#047857" rotation-x={15}/>
          <Text
            position={[0, 0, 0.001]}
            rotation-y={Math.PI * 0.25}
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
          <Plane
            position={[0.1, 0.1, 0]}
            args={[0.1, 0.0375]}
            material-color="#047857"
          />
          <Text
            position={[0.1, 0.1, 0]}
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
        </Billboard> */}
        {/* <mesh position={[0, -0.3, 0]} scale=".1">
          <Tube position={[0, 0, 0]} args={[path, 1, 0.5, 3, false]}>
            <meshNormalMaterial />
          </Tube>
        </mesh> */}
        {/* <mesh position={[0, -0.3, 0]} scale=".0001">
        <PlatformButton />
        </mesh> */}
        {/* <OrbitControls /> */}
        <MapControls />
        <Stars />
      </Canvas>
    </>
  );
}