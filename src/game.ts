import { b2Vec2 } from '../node_modules/box2d.ts/Box2D/Common/b2Math'
import { b2World } from '../node_modules/box2d.ts/Box2D/Dynamics/b2World'
import { b2FixtureDef, b2Fixture } from '../node_modules/box2d.ts/Box2D/Dynamics/b2Fixture'
import { b2BodyDef, b2BodyType, b2Body } from '../node_modules/box2d.ts/Box2D/Dynamics/b2Body'
import { b2PolygonShape } from '../node_modules/box2d.ts/Box2D/Collision/Shapes/b2PolygonShape'
import { b2CircleShape } from '../node_modules/box2d.ts/Box2D/Collision/Shapes/b2CircleShape'

// Create base scene
const baseScene = new Entity()
baseScene.addComponent(new GLTFShape("models/baseScene.glb"))
baseScene.addComponent(new Transform())
engine.addEntity(baseScene)

// Create red ball
const redMaterial = new Material()
redMaterial.albedoColor = Color3.Red()
const ballShape = new SphereShape()
const ball = new Entity()
ball.addComponent(ballShape)
ball.addComponent(redMaterial)
ball.addComponent(new Transform({}))
ball.getComponent(Transform).position.z = 8
ball.getComponent(Transform).scale.setAll(1)
engine.addEntity(ball)

// Define the gravity vector.
const gravity: b2Vec2 = new b2Vec2(0, -10)

// Construct a world object, which will hold and simulate the rigid bodies.
const world: b2World = new b2World(gravity)

// Define the ground body.
const groundBodyDef: b2BodyDef = new b2BodyDef()
groundBodyDef.position.Set(0, -10)

// Call the body factory which allocates memory for the ground body
// from a pool and creates the ground box shape (also from a pool).
// The body is also added to the world.
const groundBody: b2Body = world.CreateBody(groundBodyDef)

// Define the ground box shape.
const groundBox: b2PolygonShape = new b2PolygonShape()

// The extents are the half-widths of the box.
groundBox.SetAsBox(50, 10)

// Add the ground fixture to the ground body.
groundBody.CreateFixture(groundBox, 0)

// Define the dynamic body. We set its position and call the body factory.
const bodyDef: b2BodyDef = new b2BodyDef()
bodyDef.type = b2BodyType.b2_dynamicBody
bodyDef.position.Set(8, 8)
const body: b2Body = world.CreateBody(bodyDef)

// Define another box shape for our dynamic body.
const dynamicBox: b2CircleShape = new b2CircleShape(1) // Radius to match ball radius

// Define the dynamic body fixture.
const fixtureDef: b2FixtureDef = new b2FixtureDef()
fixtureDef.shape = dynamicBox

// Set the box density to be non-zero, so it will be dynamic.
fixtureDef.density = 0.75

// Override the default friction.
fixtureDef.friction = 0.5

// Setting the bounciness of the ball
fixtureDef.restitution = 0.6

// Add the shape to the body.
const fixture: b2Fixture = body.CreateFixture(fixtureDef)

// Prepare for simulation. Typically we use a time step of 1/60 of a
// second (60Hz) and 10 iterations. This provides a high quality simulation
// in most game scenarios.
const timeStep: number = 1 / 60 // UNUSED: using dt instead
const velocityIterations: number = 6
const positionIterations: number = 2

class updateSystem implements ISystem {
  update(dt: number): void {
    // Instruct the world to perform a single step of simulation.
    // It is generally best to keep the time step and iterations fixed.
    world.Step(dt, velocityIterations, positionIterations)

    // Now print the position and angle of the body.
    const position: b2Vec2 = body.GetPosition()
    const angle: number = body.GetAngle()

    ball.getComponent(Transform).position.x = position.x
    ball.getComponent(Transform).position.y = position.y

    // log(position.x.toFixed(2), position.y.toFixed(2), angle.toFixed(2))
  }
}

engine.addSystem(new updateSystem())
