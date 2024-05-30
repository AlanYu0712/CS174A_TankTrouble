import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Axis extends Shape {
    constructor() {
        super("position", "normal");
        this.arrays.position = Vector3.cast(
            [0,0,0], [10,0,0], 
            [0,0,0], [0,10,0], 
            [0,0,0], [0,0,10]
        );
        this.arrays.color = [
            vec4(1,0,0,1), vec4(1,0,0,1),
            vec4(0,1,0,1), vec4(0,1,0,1),
            vec4(0,0,1,1), vec4(0,0,1,1)
        ];
        this.indices = false;
    }
}

class Bullet {
    constructor(x, y, rot) {
        this.x = x;
        this.y = y;
        this.z = -5;
        this.rot = rot;
        this.rad = 0.6
        this.v = 12.0;
        this.life = 480;
    }

    change_rot(theta) {
        this.rot = theta - this.rot;
    }
}

class Tank extends Shape{
    constructor(position){
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);


        this.position = position;
    }

    get x() {
        return this.position[0][3];
      }
    
    get y() {
        return this.position[1][3];
      }
    
    get r() {
        return Math.atan2(this.position[1][0],this.position[0][0])
    }
}

class Background extends Shape { //triangle strip cubes for walls and ground
    constructor() {
        super("position", "normal");
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
                14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

const Flat_Shaded_Cube = defs.Flat_Shaded_Cube =
    class Flat_Shaded_Cube extends (defs.Cube.prototype.make_flat_shaded_version()) {}

export class Game extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        
        // Tank Speed
        this.tank_move_speed = 0.16;
        this.tank_rot_speed = 0.04;

        // player 1  
        this.p1_bullets = [];
        this.p1_bullet_cnt = 5;
        this.p1_move_forward = this.p1_move_backward = this.p1_rot_left = this.p1_rot_right = false;
        this.p1_x = 0;
        this.p1_y = 0;
        this.p1_rot = 0;
        this.p1_life = 1;


        // player 2  
        this.p2_bullets = [];
        this.p2_bullet_cnt = 5;
        this.p2_move_forward = this.p2_move_backward=this.p2_rot_left=this.p2_rot_right = false;
        this.p2_x = 0;
        this.p2_y = 0;
        this.p2_rot = 0;
        this.p2_life = 1;

        var mazes = [];
        this.h_walls = [];
        this.v_walls = [];
        const outline = [0,7,14,21,28,35,  42,43,44,45,46,47,  6,13,20,27,34,41, 78,79,80,81,82,83];
        this.walls_to_add = outline;

        for (let i = 0; i<30; i++){
            this.walls_to_add = this.walls_to_add.concat(Math.floor(Math.random() * 77))
        }

        this.generate_walls = () => {
            this.walls_to_add = outline;
            for (let i = 0; i<30; i++){
                this.walls_to_add = this.walls_to_add.concat(Math.floor(Math.random() * 77))
            }
        }

        this.shootBulletp1 = (x, y, rot) => {
            if (this.p1_bullet_cnt != 0 && this.p1_life == 1) {
                this.p1_bullets.push(new Bullet(x, y, rot));
                this.p1_bullet_cnt -= 1;
            }
        }

        this.shootBulletp2 = (x, y, rot) => {
            if (this.p2_bullet_cnt != 0 && this.p2_life == 1) {
                this.p2_bullets.push(new Bullet(x, y, rot));
                this.p2_bullet_cnt -= 1;
            }
        }


        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'axis': new Axis(),
            bullet: new defs.Subdivision_Sphere(4),
            floor: new Background(),
            border: new Background(),
            p1: new Tank(Mat4.identity().times(Mat4.translation(5, 10, 1))),
            p2: new Tank(Mat4.identity().times(Mat4.translation(-6, -8, 1))),
        };

        // *** Materials
        this.white = new Material(new defs.Basic_Shader());

        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828")}),
            
            ground: new Material(new Gouraud_Shader(),
                {ambient: 0.5, diffusivity: 0.6, color: hex_color("#9B7653")}),

            wall: new Material(new defs.Phong_Shader(),
                {ambient: 0.5, diffusivity: 0.6, color: hex_color("#C3C3C3")}),

            bullet: new Material(new defs.Phong_Shader(), 
            {ambient: 0.8, diffusivity: 1, color: hex_color('#000000'), specularity: 1, smoothness: 30}),

            tank1_mat: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0, color: hex_color("#1a9ffa"), specularity: 0}),
            
            tank2_mat: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0, color: hex_color("#FF0000"), specularity: 0}),
        }
        // changed camera angle to be more perspective - Nathan
        this.initial_camera_location = Mat4.look_at(vec3(0, -15, 80), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.                                                                      
        this.key_triggered_button("Generate map", ["m"], () => this.generate_walls()); //eventually change to random variable - Nathan
        this.new_line();
        this.new_line();
        //P1
        this.key_triggered_button("P1 Tank Forward", ["w"], ()=>{this.p1_move_forward = true},undefined,()=>{this.p1_move_forward=false});
        this.key_triggered_button("P1 Tank Backward", ["s"], ()=>{this.p1_move_backward = true},undefined,()=>{this.p1_move_backward=false});
        this.key_triggered_button("P1 Tank Rotate Left", ["a"], ()=>{this.p1_rot_left = true},undefined,()=>{this.p1_rot_left=false});
        this.key_triggered_button("P1 Tank Rotate Right", ["d"], ()=>{this.p1_rot_right = true},undefined,()=>{this.p1_rot_right=false});
        this.key_triggered_button("P1 Shoot bullet", ["v"], () => this.shootBulletp1(this.p1_x + 1.5*Math.cos(this.p1_rot), this.p1_y + 1.5*Math.sin(this.p1_rot), this.p1_rot));
        
        this.new_line();
        this.new_line();

        //P2
        this.key_triggered_button("P2 Tank Forward", ["o"], ()=>{this.p2_move_forward = true},undefined,()=>{this.p2_move_forward=false});
        this.key_triggered_button("P2 Tank Backward", ["l"], ()=>{this.p2_move_backward = true},undefined,()=>{this.p2_move_backward=false});
        this.key_triggered_button("P2 Tank Rotate Left", ["k"], ()=>{this.p2_rot_left = true},undefined,()=>{this.p2_rot_left=false});
        this.key_triggered_button("P2 Tank Rotate Right", [";"], ()=>{this.p2_rot_right = true},undefined,()=>{this.p2_rot_right=false});
        this.key_triggered_button("P2 Shoot bullet", ["n"], () => this.shootBulletp2(this.p2_x + 1.5*Math.cos(this.p2_rot), this.p2_y + 1.5*Math.sin(this.p2_rot), this.p2_rot));

        
        // this.new_line();
    }

    bullet_wall_collision(bullet_x, bullet_y, bullet_rad, wall_x, wall_y, wall_len, wall_wid) {
        // treat the bullet like it has a cube around it
        let bullet_l = bullet_x - bullet_rad;
        let bullet_r = bullet_x + bullet_rad;
        let bullet_t = bullet_y + bullet_rad;
        let bullet_b = bullet_y - bullet_rad;

        let wall_l = wall_x - wall_wid;
        let wall_r = wall_x + wall_wid;
        let wall_t = wall_y + wall_len;
        let wall_b = wall_y - wall_len;

        return (bullet_l < wall_r && bullet_r > wall_l && bullet_b < wall_t && bullet_t > wall_b);
    }

    areVectorsEqual(vec1, vec2) {
        if (vec1.length !== vec2.length) 
            return false;
        for (let i = 0; i < vec1.length; i++) {
          if (vec1[i] !== vec2[i]) 
            return false;
        }
        return true;
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        let model_transform = Mat4.identity();
        
        // drawing axis for reference
        // this.shapes.axis.draw(context, program_state, model_transform, this.white, "LINES");
        
        // manipulating light
        const light_position = vec4(0, 0, 20, 1); //changed to be higher - Nathan
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 5000)]; //changed to be a little brighter - Nathan 

        // generate ground for the stage - Nathan
        let floor_transform = Mat4.scale(24.0,24.0,0.2).times(Mat4.translation(0, 0, -1.0));
        this.shapes.floor.draw(context, program_state, floor_transform, this.materials.ground);

        // generate a couple walls for the stage - Nathan
        const wall_transform = [];
        this.v_walls = [];
        this.h_walls = [];
        var wall_index = 0;

        /*
        for (let y = -2; y<4; y++){
            for (let x = -3; x<4; x++){
                wall_transform[wall_index] = Mat4.translation(8*x, 0, 8*y).times(Mat4.rotation(Math.PI/2,0,1,0)).times(Mat4.scale(4.0,2.0,0.25)).times(Mat4.translation(1, 0, 0));
                wall_index++;
            }
        }
        for (let y = -3; y<4; y++){
            for (let x = -3; x<3; x++){
                wall_transform[wall_index] = Mat4.translation(8*x, 0, 8*y).times(Mat4.scale(4.0,2.0,0.25)).times(Mat4.translation(1, 0, 0));
                wall_index++;
            }
        }
        */
       // 0-41 VERTICAL WALLS
        for (let y = -3; y<3; y++){
            for (let x = -3; x<4; x++){
                wall_transform[wall_index] = Mat4.translation(8*x,8*y,0).times(Mat4.rotation(Math.PI/2,0,0,1)).times(Mat4.scale(4.0,0.25,2.0)).times(Mat4.translation(1, 0, 0));
                wall_index++;
            }
        }
        // 42-83 HORIZONTAL WALLS
        for (let y = -3; y<4; y++){
            for (let x = -3; x<3; x++){
                wall_transform[wall_index] = Mat4.translation(8*x,8*y,0).times(Mat4.scale(4.0,0.25,2.0)).times(Mat4.translation(1, 0, 0));
                wall_index++;
            }
        }
        for (let i = 0; i<this.walls_to_add.length; i++){
            this.shapes.border.draw(context, program_state, wall_transform[this.walls_to_add[i]], this.materials.wall);

            let transform = wall_transform[this.walls_to_add[i]];
            let position = vec3(transform[0][3], transform[1][3], transform[2][3]);
            if (this.walls_to_add[i] < 42) {
                this.v_walls.push(position)
            }
            else {
                this.h_walls.push(position)
            }
        }
        this.v_walls = this.v_walls.filter((vec, index) => {
            return this.v_walls.findIndex(otherVec => this.areVectorsEqual(vec, otherVec)) === index;
        });
        this.h_walls = this.h_walls.filter((vec, index) => {
            return this.h_walls.findIndex(otherVec => this.areVectorsEqual(vec, otherVec)) === index;
        });
        

        //TANK
        //Tank P1
        if (this.p1_life == 1) {
            if (this.p1_move_forward){
                this.shapes.p1.position = this.shapes.p1.position.times(Mat4.translation(this.tank_move_speed,0,0));
            }else if (this.p1_move_backward){
                this.shapes.p1.position = this.shapes.p1.position.times(Mat4.translation(-this.tank_move_speed,0,0));
            } 
            if (this.p1_rot_left){
                this.shapes.p1.position = this.shapes.p1.position.times(Mat4.rotation(this.tank_rot_speed,0,0,1));
            }else if (this.p1_rot_right){
                this.shapes.p1.position = this.shapes.p1.position.times(Mat4.rotation(-this.tank_rot_speed,0,0,1));
            }
            this.shapes.p1.draw(context, program_state, this.shapes.p1.position, this.materials.tank1_mat);
            this.p1_x = this.shapes.p1.x;
            this.p1_y = this.shapes.p1.y;
            this.p1_rot = this.shapes.p1.r;
        }
        
        //Tank P2
        if (this.p2_life == 1) {
            if (this.p2_move_forward){
                this.shapes.p2.position = this.shapes.p2.position.times(Mat4.translation(this.tank_move_speed,0,0));
            }else if (this.p2_move_backward){
                this.shapes.p2.position = this.shapes.p2.position.times(Mat4.translation(-this.tank_move_speed,0,0));
            } 
            if (this.p2_rot_left){
                this.shapes.p2.position = this.shapes.p2.position.times(Mat4.rotation(this.tank_rot_speed,0,0,1));
            }else if (this.p2_rot_right){
                this.shapes.p2.position = this.shapes.p2.position.times(Mat4.rotation(-this.tank_rot_speed,0,0,1));
            }
            this.shapes.p2.draw(context, program_state, this.shapes.p2.position, this.materials.tank2_mat);
            this.p2_x = this.shapes.p2.x;
            this.p2_y = this.shapes.p2.y;
            this.p2_rot = this.shapes.p2.r;
        }
        
        
        // draw the bullets for p1
        for(let i = 0; i < this.p1_bullets.length; i++) {
            let curBullet = this.p1_bullets[i];
            curBullet.x = curBullet.x + (Math.cos(curBullet.rot) * curBullet.v*dt);
            curBullet.y = curBullet.y + (Math.sin(curBullet.rot) * curBullet.v*dt);
            let bullet_transform = Mat4.translation(curBullet.x, curBullet.y, 0).times(Mat4.scale(curBullet.rad, curBullet.rad, curBullet.rad));
            this.shapes.bullet.draw(context, program_state, bullet_transform, this.materials.bullet);
        }
        // p1 bullet-wall & bullet-tank collision
        for(let i = 0; i < this.p1_bullets.length; i++) {
            let curBullet = this.p1_bullets[i];
            this.v_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 4.0, 0.25)) {
                    this.p1_bullets[i].change_rot(Math.PI);
                }
            })
            this.h_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 0.25, 4.0)) {
                    this.p1_bullets[i].change_rot(0);
                }
            })
            // check collision for both self and opponent tank
            if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p2_x, this.p2_y, 0.5, 0.5)) {
                this.p2_life = 0;
                this.p2_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p2_y = 100;
                this.p1_bullets.splice(i, 1);
                this.p1_bullet_cnt += 1;
            }
            else if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p1_x, this.p1_y, 0.5, 0.5)) {
                this.p1_life = 0;
                this.p1_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p1_y = 100;
                this.p1_bullets.splice(i, 1);
                this.p1_bullet_cnt += 1;
            }
        }
        // bullets disappear after couple of seconds
        for(let i = 0; i < this.p1_bullets.length; i++) {
            let curBullet = this.p1_bullets[i];
            curBullet.life -= 1;
            if (curBullet.life == 0) {
                this.p1_bullets.splice(i, 1);
                this.p1_bullet_cnt += 1;
            }   
        }

        // draw the bullets for p2
        for(let i = 0; i < this.p2_bullets.length; i++) {
            let curBullet = this.p2_bullets[i];
            curBullet.x = curBullet.x + (Math.cos(curBullet.rot) * curBullet.v*dt);
            curBullet.y = curBullet.y + (Math.sin(curBullet.rot) * curBullet.v*dt);
            let bullet_transform = Mat4.translation(curBullet.x, curBullet.y, 0).times(Mat4.scale(0.5, 0.5, 0.5));
            this.shapes.bullet.draw(context, program_state, bullet_transform, this.materials.bullet);
        }
        // p2 bullet-wall collision
        for(let i = 0; i < this.p2_bullets.length; i++) {
            let curBullet = this.p2_bullets[i];
            this.v_walls.forEach((wall) => {
                if (this.bullet_v_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], vec(4.0, 0.25))) {
                    this.p2_bullets[i].change_rot(Math.PI);
                }
            })
            this.h_walls.forEach((wall) => {
                if (this.bullet_h_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], vec(4.0, 0.25))) {
                    this.p2_bullets[i].change_rot(0);
                }
            })
            if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p1_x, this.p1_y, 0.5, 0.5)) {
                this.p1_life = 0;
                this.p1_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p1_y = 100;
                this.p2_bullets.splice(i, 1);
                this.p2_bullet_cnt += 1;
            }
            else if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p2_x, this.p2_y, 0.5, 0.5)) {
                this.p2_life = 0;
                this.p2_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p2_y = 100;
                this.p2_bullets.splice(i, 1);
                this.p2_bullet_cnt += 1;
            }
        }
        // bullets disappear after couple of seconds
        for(let i = 0; i < this.p2_bullets.length; i++) {
            let curBullet = this.p2_bullets[i];
            curBullet.life -= 1;
            if (curBullet.life == 0) {
                this.p2_bullets.splice(i, 1);
                this.p2_bullet_cnt += 1;
            }   
        }


        if (this.attached != undefined) {
            program_state.camera_inverse = this.attached().map((x,i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.1))
        }
    }
}


class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 vertex_color;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
            // uniform vec4 shape_color;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                vertex_color = vec4( shape_color.xyz * ambient, shape_color.w );
                vertex_color.xyz += phong_model_lights( N , vertex_worldspace );
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                gl_FragColor = vertex_color;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            center = model_transform * vec4(0,0,0,1);
            point_position = model_transform * vec4(position, 1);
            gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
            gl_FragColor = sin(18.0*distance(center.xyz, point_position.xyz)) * vec4(0.69, 0.50, 0.25, 1);
        }`;
    }
}

