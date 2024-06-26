import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong} = defs

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
        this.rad = 0.4;
        this.v = 12.0;
        this.life = 480;
    }

    change_rot(theta) {
        this.rot = theta - this.rot;
    }
}

class Powerup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Speed {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Tank extends Shape{ //SHOOTS IN THE +X direction
    constructor(position){
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        var tread_width = 0.8;
        var tread_height = 0.4;
        var turret_width = 0.5;
        var barrel_width = 0.2;
        this.arrays.position = Vector3.cast(
            [-0.8,-tread_width,-tread_height], [-0.8,-tread_width,-1], [0.6,-tread_width,-1], [0.6,-tread_width,-tread_height], //treads
            [-1,-tread_width,-0.6], [-1, tread_width,-0.6], [0.8, tread_width,-0.6], [0.8,-tread_width,-0.6],
            [-0.8, tread_width,-tread_height], [-0.8, tread_width,-1], [0.6, tread_width,-1], [0.6, tread_width,-tread_height],
            
            [-0.6,-turret_width,-tread_height], [-0.6,-turret_width, 0.2], [0.4,-turret_width, 0.2], [0.4,-turret_width,-tread_height], //turret 
            [-0.6, turret_width,-tread_height], [-0.6, turret_width, 0.2], [0.4, turret_width, 0.2], [0.4, turret_width,-tread_height],

            [0.4,-barrel_width,-0.25], [0.4,-barrel_width, 0.1], [1.2,-barrel_width, 0.1], [1.2,-barrel_width,-0.25], //barrel
            [0.4, barrel_width,-0.25], [0.4, barrel_width, 0.1], [1.2, barrel_width, 0.1], [1.2, barrel_width,-0.25]
        );
        //Normal vectors are equivalent to position points
        this.arrays.normal = Vector3.cast(
            [-0.8,-tread_width,-tread_height], [-0.8,-tread_width,-1], [0.6,-tread_width,-1], [0.6,-tread_width,-tread_height], //treads
            [-1,-tread_width,-0.6], [-1, tread_width,-0.6], [0.8, tread_width,-0.6], [0.8,-tread_width,-0.6],
            [-0.8, tread_width,-tread_height], [-0.8, tread_width,-1], [0.6, tread_width,-1], [0.6, tread_width,-tread_height],
            
            [-0.6,-turret_width,-tread_height], [-0.6,-turret_width, 0.2], [0.4,-turret_width, 0.2], [0.4,-turret_width,-tread_height], //turret 
            [-0.6, turret_width,-tread_height], [-0.6, turret_width, 0.2], [0.4, turret_width, 0.2], [0.4, turret_width,-tread_height],

            [0.4,-barrel_width,-0.25], [0.4,-barrel_width, 0.1], [1.2,-barrel_width, 0.1], [1.2,-barrel_width,-0.25], //barrel
            [0.4, barrel_width,-0.25], [0.4, barrel_width, 0.1], [1.2, barrel_width, 0.1], [1.2, barrel_width,-0.25]);
        
        
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 3, 2, 0, 1, 2,  //left and right treads
                          8, 9, 10, 8, 11, 10,
                          4, 0, 1, 3, 7, 2, 5, 8, 9, 10, 6, 11,
                          0, 8, 5, 0, 4, 5, 1, 9, 5, 1, 4, 5,   
                          3, 11, 6, 3, 7, 6, 2, 10, 6, 2, 7, 6, //front and back of treads
                          0, 8, 3, 8, 11, 3, 1, 9, 2, 2, 9, 10, //top and bottom of treads

                          12, 13, 14, 12, 15, 14, 16, 19, 18, 16, 17, 18, //left and right of turret
                          12, 16, 17, 12, 13, 17, 15, 19, 18, 15, 14, 18, //front and back of turret
                          13, 17, 14, 14, 18, 17, 12, 16, 19, 12, 15, 19, //top and bottom of turret
                          
                          20, 21, 22, 20, 23, 22, 24, 27, 26, 24, 25, 26, //left and right of barrel
                          20, 24, 25, 20, 21, 25, 23, 27, 26, 23, 22, 26, //front and back of barrel
                          21, 25, 22, 22, 26, 25, 20, 24, 27, 20, 23, 27 //top and bottom of barrel
                         );


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

class Tank_Outline extends Shape {
    constructor() {
        super("position", "color");
        var tread_width = 0.8;
        var tread_height = 0.4;
        var turret_width = 0.5;
        var barrel_width = 0.2;
        
        this.arrays.position = Vector3.cast(
            [-0.8,-tread_width,-tread_height], [0.6,-tread_width,-tread_height], [-0.8,-tread_width,-1], [0.6,-tread_width,-1], //right tread
            [-0.8, tread_width,-tread_height], [0.6, tread_width,-tread_height], [-0.8, tread_width,-1], [0.6, tread_width,-1], //left tread
            [-0.8,-tread_width,-tread_height], [-0.8, tread_width,-tread_height], [0.6,-tread_width,-tread_height], [0.6, tread_width,-tread_height], 
            [-0.8,-tread_width,-1], [-0.8, tread_width,-1], [0.6,-tread_width,-1], [0.6, tread_width,-1], 
            
            [-1,-tread_width,-0.6], [-0.8,-tread_width,-tread_height], [-1,-tread_width,-0.6], [-0.8,-tread_width,-1], 
            [-1, tread_width,-0.6], [-0.8, tread_width,-tread_height], [-1, tread_width,-0.6], [-0.8, tread_width,-1], 
            
            [0.8,-tread_width,-0.6], [0.6,-tread_width,-tread_height], [0.8,-tread_width,-0.6], [0.6,-tread_width,-1], 
            [0.8, tread_width,-0.6], [0.6, tread_width,-tread_height], [0.8, tread_width,-0.6], [0.6, tread_width,-1], 

            [0.8,-tread_width,-0.6], [0.8, tread_width,-0.6], [-1,-tread_width,-0.6], [-1, tread_width,-0.6], 
            /////////end of treads
            
            [-0.6,-turret_width,-tread_height], [-0.6,-turret_width, 0.2], [0.4,-turret_width, 0.2], [0.4,-turret_width,-tread_height], //turret 
            [-0.6, turret_width,-tread_height], [-0.6, turret_width, 0.2], [0.4, turret_width, 0.2], [0.4, turret_width,-tread_height],
            
            [-0.6,-turret_width,-tread_height], [-0.6, turret_width,-tread_height], [-0.6,-turret_width, 0.2], [-0.6, turret_width, 0.2], 
            [0.4,-turret_width, 0.2], [0.4, turret_width, 0.2], [0.4, turret_width,-tread_height], [0.4,-turret_width,-tread_height], //turret 
            
            [-0.6,-turret_width,-tread_height], [0.4,-turret_width,-tread_height], [-0.6,-turret_width, 0.2], [0.4,-turret_width, 0.2], //turret 
            [-0.6, turret_width,-tread_height], [0.4, turret_width,-tread_height], [-0.6, turret_width, 0.2], [0.4, turret_width, 0.2], 
            /////////end of turrent

            [0.4,-barrel_width,-0.25], [0.4,-barrel_width, 0.1], [1.2,-barrel_width, 0.1], [1.2,-barrel_width,-0.25], //barrel
            [0.4, barrel_width,-0.25], [0.4, barrel_width, 0.1], [1.2, barrel_width, 0.1], [1.2, barrel_width,-0.25],
            
            [0.4,-barrel_width,-0.25], [0.4, barrel_width,-0.25], [0.4,-barrel_width, 0.1], [0.4, barrel_width, 0.1], 
            [1.2,-barrel_width, 0.1], [1.2, barrel_width, 0.1], [1.2,-barrel_width,-0.25], [1.2, barrel_width,-0.25], //barrel
            
            [0.4,-barrel_width,-0.25], [1.2,-barrel_width,-0.25], [0.4,-barrel_width, 0.1], [1.2,-barrel_width, 0.1], //barrel
            [0.4, barrel_width,-0.25], [1.2, barrel_width,-0.25], [0.4, barrel_width, 0.1], [1.2, barrel_width, 0.1]
        
        );
        this.arrays.color = Vector3.cast(
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            //end of treads
            
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            //end of turrent
            
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"),
            
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"),
        
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), 
            hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff"), hex_color("#ffffff")
        );
        this.indices = false;
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

class Grass extends Shape {
    constructor() {
        super("position", "normal");
        this.arrays.position = Vector3.cast(
            [0.4, -0.8, 0], [0.65, -0.8, 3], [0.9,-0.8,0],
            [0.1, -0.9, 0], [-0.2, -0.9, 3], [-0.5,-0.9,0],
            [-0.7, -1, 0], [-0.85, -0.8, 3], [-1,-0.6,0],
            [-0.8, -0.5, 0], [-0.7, -0.2, 3], [-0.6,0.1,0],
            [0, -0.7, 0], [0.4, -0.4, 3], [0.8,-0.1,0],
            [0, -0.3, 0], [-0.15, -0.15, 3], [-0.3,0,0],
            [1, 0, 0], [0.6, 0.1, 3], [0.2,0.2,0],
            [0.9, 0.2, 0], [0.9, 0.3, 3], [0.9,0.4,0],
            [-0.7, 0.1, 0], [-0.4, 0.2, 3], [-0.1,0.3,0],
            [0.1, 0.3, 0], [0.9, 0.45, 3], [0.8,0.6,0],
            [0.5, 0.5, 0], [0.5, 0.7, 3], [0.5,0.9,0],
            [0, 0.5, 0], [0, 0.65, 3], [0,0.8,0],
            [-0.7, 0.7, 0], [-0.65, 0.85, 3], [-0.6,1,0],
            [-0.8, 0.5, 0], [-0.9, 0.65, 3], [-1,0.8,0]
        );
        this.arrays.normal = Vector3.cast(
            [0.4, -0.8, 0], [0.65, -0.8, 3], [0.9,-0.8,0],
            [0.1, -0.9, 0], [-0.2, -0.9, 3], [-0.5,-0.9,0],
            [-0.7, -1, 0], [-0.85, -0.8, 3], [-1,-0.6,0],
            [-0.8, -0.5, 0], [-0.7, -0.2, 3], [-0.6,0.1,0],
            [0, -0.7, 0], [0.4, -0.4, 3], [0.8,-0.1,0],
            [0, -0.3, 0], [-0.15, -0.15, 3], [-0.3,0,0],
            [1, 0, 0], [0.6, 0.1, 3], [0.2,0.2,0],
            [0.9, 0.2, 0], [0.9, 0.3, 3], [0.9,0.4,0],
            [-0.7, 0.1, 0], [-0.4, 0.2, 3], [-0.1,0.3,0],
            [0.1, 0.3, 0], [0.9, 0.45, 3], [0.8,0.6,0],
            [0.5, 0.5, 0], [0.5, 0.7, 3], [0.5,0.9,0],
            [0, 0.5, 0], [0, 0.65, 3], [0,0.8,0],
            [-0.7, 0.7, 0], [-0.65, 0.85, 3], [-0.6,1,0],
            [-0.8, 0.5, 0], [-0.9, 0.65, 3], [-1,0.8,0]
        );
        this.indices.push(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,
                         31,32,33,34,35,36,37,38,39,40,41);
    }
}



const Flat_Shaded_Cube = defs.Flat_Shaded_Cube =
    class Flat_Shaded_Cube extends (defs.Cube.prototype.make_flat_shaded_version()) {}

export class Game extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        //Round
        this.round_refresh_t = 4000;

        //Life Box
        this.balloon_offset = 3.25; // Adjust this value to position the balloon above the tank
        this.balloon_left_offset = 0.75;
        this.balloon_right_offset = -0.75;
        
        // Tank Speed
        this.tank1_move_speed = 0.12;
        this.tank1_rot_speed = 0.05;
        this.tank2_move_speed = 0.12;
        this.tank2_rot_speed = 0.05;

        // player 1  
        this.p1_bullets = [];
        this.p1_shotgun_bullets = [];
        this.p1_bullet_cnt = 5;
        this.p1_move_forward = this.p1_move_backward = this.p1_rot_left = this.p1_rot_right = false;
        this.p1_x = 0;
        this.p1_y = 0;
        this.p1_rot = 0;
        this.p1_life = 3;
        this.p1_shotgun_mode = 0;


        // player 2  
        this.p2_bullets = [];
        this.p2_shotgun_bullets = [];
        this.p2_bullet_cnt = 5;
        this.p2_move_forward = this.p2_move_backward=this.p2_rot_left=this.p2_rot_right = false;
        this.p2_x = 0;
        this.p2_y = 0;
        this.p2_rot = 0;
        this.p2_life = 3;
        this.p2_shotgun_mode = 0;

        //Camera Positions
        this.camera_mode = 0; //0 = initial overhead position, 1 = player 1 position, 2 = player 2 position
        
        //Mazes
        var mazes = [];
        this.h_walls = [];
        this.v_walls = [];
        this.borderV = [];
        this.borderH = [];
        const outline = [60,61,62,63];
        const maze_1 = [60,61,62,63,1,3,36,38,41,11,18,48,51,53,26,28];
        const maze_2 = [60,61,62,63,31,32,33,34,36,37,40,41,43,44,45,46,48,49,52,53,55,56,57,58];
        const maze_3 = [60,61,62,63,30,31,32,33,34,40,14,15,49,55,56,57,58,59];
        this.walls_to_add = maze_1;
        const num_walls = 20;
        //for (let i = 0; i<num_walls; i++){
            //this.walls_to_add = this.walls_to_add.concat(Math.floor(Math.random() * 59))
        //}

        this.particles1 = [];
        this.particles2 = [];
        this.gravity = vec(0, -13.0, 0);

        //Grass
        this.grass_to_add = [20,21,14,15,19,26,9,16];
        const num_grass = 5;
        const grass_1 = [20,21,14,15,19,26,9,16];
        const grass_2 = [25,26,27,28,18,19,16,17,7,8,9,10];
        const grass_3 = [9,12,14,21,23,26];
        //for (let i = 0; i<num_grass; i++){
            //this.grass_to_add = this.grass_to_add.concat(Math.floor(Math.random() * 35))
        //}
        
        // powerups
        this.speed_timer = 4000;
        this.timer = 0;
        this.powerups = [];
        const powerups_1 = [25,10];
        const powerups_2 = [12,23];
        const powerups_3 = [24,11];
        const num_powerups = 2;
        this.powerup_pos = [25,10];
        //for (let i = 0; i<num_powerups; i++){
            //this.powerup_pos = this.powerup_pos.concat(Math.floor(Math.random() * 35))
        //}
        
        
        this.soundEffects = {
            score: new Audio('assets/ittybitty.mp3'),
            shoot: new Audio('assets/shoot.mp3'),
            bounce: new Audio('assets/bounce.mp3'),
            explode: new Audio('assets/explosion.mp3'),
            shotgun: new Audio('assets/shotgun.mp3'),
            shotgun_shoot: new Audio('assets/shotgun_shoot.mp3'),
            speedup: new Audio('assets/speedup.mp3')
        }
        this.soundEffects.score.volume = 0.2;

        this.generate_map_1 = () => {
            this.walls_to_add = maze_1;
            this.grass_to_add = grass_1;
            this.powerups = [];
            this.powerup_pos = powerups_1;
            this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5)).times(Mat4.rotation(Math.PI,0,0,1));
            this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
        }

        this.generate_map_2 = () => {
            this.walls_to_add = maze_2;
            this.grass_to_add = grass_2;
            this.powerups = [];
            this.powerup_pos = powerups_2;
            this.shapes.p1.position = Mat4.identity().times(Mat4.translation(0, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5)).times(Mat4.rotation(-Math.PI/2,0,0,1));
            this.shapes.p2.position = Mat4.identity().times(Mat4.translation(0, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5)).times(Mat4.rotation(Math.PI/2,0,0,1));
        }

        this.generate_map_3 = () => {
            this.walls_to_add = maze_3;
            this.grass_to_add = grass_3;
            this.powerups = [];
            this.powerup_pos = powerups_3;
            this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5)).times(Mat4.rotation(Math.PI,0,0,1));
            this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
        }

        this.pick_premade_map = () => {
            let map_num = Math.floor(Math.random() * 3)+1;
            switch(map_num){
                case 1:
                    this.generate_map_1();
                    break;
                case 2:
                    this.generate_map_2();
                    break;
                case 3:
                    this.generate_map_3();
                    break;
                default:
                    this.generate_walls();
            }
        }
        
        this.generate_walls = () => {
            this.walls_to_add = outline;
            for (let i = 0; i<num_walls; i++){
                this.walls_to_add = this.walls_to_add.concat(Math.floor(Math.random() * 59))
            }
            
            this.grass_to_add = [];
            for (let i = 0; i<num_grass; i++){
                this.grass_to_add = this.grass_to_add.concat(Math.floor(Math.random() * 35))
            }
            this.powerups = [];
            this.powerup_pos = [];
            for (let i = 0; i<num_powerups; i++){
                this.powerup_pos = this.powerup_pos.concat(Math.floor(Math.random() * 35))
            }
            
            this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5)).times(Mat4.rotation(Math.PI,0,0,1));
            this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
        }

        this.shootBulletp1 = (x, y, rot) => {
            if (this.p1_bullet_cnt != 0 && this.p1_life >0) {
                this.p1_bullets.push(new Bullet(x, y, rot));
                this.p1_bullet_cnt -= 1;
                const newSound = this.soundEffects.shoot.cloneNode();
                newSound.play();
            }
        }
        // Add a shoot special function for shotgun where you store 5 bullets immediately and then toggle shotgun mode off
        this.shootShotgunp1 = (x, y, rot) => {
            if (this.p1_shotgun_mode == 1 && this.p1_life > 0) {
                this.p1_shotgun_mode = 0;
                this.p1_shotgun_bullets.push(new Bullet(x, y, rot));
                this.p1_shotgun_bullets.push(new Bullet(x, y, rot + 0.26));
                this.p1_shotgun_bullets.push(new Bullet(x, y, rot - 0.26));
                this.p1_shotgun_bullets.push(new Bullet(x, y, rot + 0.52));
                this.p1_shotgun_bullets.push(new Bullet(x, y, rot - 0.52));
                const newSound = this.soundEffects.shotgun_shoot.cloneNode();
                newSound.play();
            }
        }

        this.shootBulletp2 = (x, y, rot) => {
            if (this.p2_bullet_cnt != 0 && this.p2_life > 0) {
                this.p2_bullets.push(new Bullet(x, y, rot));
                this.p2_bullet_cnt -= 1;
                const newSound = this.soundEffects.shoot.cloneNode();
                newSound.play();
            }
        }

        this.shootShotgunp2 = (x, y, rot) => {
            if (this.p2_shotgun_mode == 1 && this.p2_life > 0) {
                this.p2_shotgun_mode = 0;
                this.p2_shotgun_bullets.push(new Bullet(x, y, rot));
                this.p2_shotgun_bullets.push(new Bullet(x, y, rot + 0.26));
                this.p2_shotgun_bullets.push(new Bullet(x, y, rot - 0.26));
                this.p2_shotgun_bullets.push(new Bullet(x, y, rot + 0.52));
                this.p2_shotgun_bullets.push(new Bullet(x, y, rot - 0.52));
                const newSound = this.soundEffects.shotgun_shoot.cloneNode();
                newSound.play();
            }
        }

        
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'axis': new Axis(),
            powerup: new Cube(),
            particle: new defs.Subdivision_Sphere(3),
            bullet: new defs.Subdivision_Sphere(4),
            floor: new Cube(),
            border1: new Cube(),
            border2: new Cube(),
            fence: new Cube(),
            p1: new Tank(Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5)).times(Mat4.rotation(Math.PI,0,0,1))),
            p1_outline: new Tank_Outline(Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5)).times(Mat4.rotation(Math.PI,0,0,1))),
            p2: new Tank(Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5))),
            p2_outline: new Tank_Outline(Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5)).times(Mat4.rotation(Math.PI,0,0,1))),
            box: new Cube(),
            bush: new Grass(),
            p1_lc_1: new Cube(),
            p1_lc_2: new Cube(),
            p1_lc_3: new Cube(),
            p2_lc_1: new Cube(),
            p2_lc_2: new Cube(),
            p2_lc_3: new Cube(),
            winning_page: new Cube(),
        };

        // *** Materials
        this.white = new Material(new defs.Basic_Shader());

        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test_T: new Material(new Textured_Phong(),
                {ambient: 0.6, diffusivity: .6, color: hex_color("#000000"),
                texture: new Texture("assets/green_camo.jpg", "LINEAR_MIPMAP_LINEAR")
                }),
            
            ground: new Material(new Textured_Phong(),
                {ambient: 0.3, diffusivity: 0.0, color: hex_color("#C4A484"),
                texture: new Texture("assets/ground.jpg")
                }),

            wall: new Material(new Textured_Phong(),
                {ambient: 0.5, diffusivity: 0.6, color: hex_color("#C3C3C3"),
                texture: new Texture("assets/brick.jpg")}),

            bullet: new Material(new defs.Phong_Shader(), 
            {ambient: 0.8, diffusivity: 1, color: hex_color('#000000'), smoothness: 30}),

            particle1: new Material(new defs.Phong_Shader(), 
            {ambient: 0.6, diffusivity: 1, color: hex_color('#1a9ffa'), specularity: 1, smoothness: 30}),

            particle2: new Material(new defs.Phong_Shader(), 
            {ambient: 0.6, diffusivity: 1, color: hex_color('#FF0000'), specularity: 1, smoothness: 30}),

            tank1_mat: new Material(new defs.Phong_Shader(),
                {ambient: 0.6, diffusivity: 1.0, color: hex_color("#50501B"), specularity: 0}),

            tank1_life_mat: new Material(new defs.Phong_Shader(),
                {ambient: 0.6, diffusivity: 1.0, color: hex_color("#6aa84f"), specularity: 0}),
            
            tank2_mat: new Material(new defs.Phong_Shader(),
                {ambient: 0.6, diffusivity: 1.0, color: hex_color("#404F69"), specularity: 0}),

            tank2_life_mat: new Material(new defs.Phong_Shader(),
                {ambient: 0.6, diffusivity: 1.0, color: hex_color("#3d85c6"), specularity: 0}),
                
            powerup: new Material(new Textured_Phong(),
                {ambient: 1, diffusivity: 1, color: hex_color("#000000"),
                texture: new Texture("assets/item.jpg")}),

            speed: new Material(new Textured_Phong(),
                {ambient: 1, diffusivity: 1, color: hex_color("#000000"),
                texture: new Texture("assets/item.jpg")}),

            grass: new Material(new Gouraud_Shader(),
                {ambient: 0.5, diffusivity: 1, color: hex_color("#7CFC00")}),

            winning_mat_1:new Material(new defs.Textured_Phong(),
                {color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/p1_win.png")}) ,

            winning_mat_2:new Material(new defs.Textured_Phong(),
                {color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/p2_win.png")}) 
        }

        this.grass_colors = [hex_color("#485042"), hex_color("#406842"), hex_color("#485042"), hex_color("#406842")];
        // changed camera angle to be more perspective - Nathan
        this.initial_camera_location = Mat4.look_at(vec3(0, -45, 45), vec3(0, -3, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.     
        //P1
        this.key_triggered_button("P1 Tank Forward", ["w"], ()=>{this.p1_move_forward = true},undefined,()=>{this.p1_move_forward=false});
        this.key_triggered_button("P1 Tank Backward", ["s"], ()=>{this.p1_move_backward = true},undefined,()=>{this.p1_move_backward=false});
        this.key_triggered_button("P1 Tank Rotate Left", ["a"], ()=>{this.p1_rot_left = true},undefined,()=>{this.p1_rot_left=false});
        this.key_triggered_button("P1 Tank Rotate Right", ["d"], ()=>{this.p1_rot_right = true},undefined,()=>{this.p1_rot_right=false});
        this.key_triggered_button("P1 Shoot bullet", ["v"], () => this.shootBulletp1(this.p1_x + 1.8*Math.cos(this.p1_rot), this.p1_y + 1.8*Math.sin(this.p1_rot), this.p1_rot));
        this.key_triggered_button("Use Special", ["c"], () => this.shootShotgunp1(this.p1_x + 1.8*Math.cos(this.p1_rot), this.p1_y + 1.8*Math.sin(this.p1_rot), this.p1_rot));
        
        this.new_line();
        this.new_line();

        //P2
        this.key_triggered_button("P2 Tank Forward", ["o"], ()=>{this.p2_move_forward = true},undefined,()=>{this.p2_move_forward=false});
        this.key_triggered_button("P2 Tank Backward", ["l"], ()=>{this.p2_move_backward = true},undefined,()=>{this.p2_move_backward=false});
        this.key_triggered_button("P2 Tank Rotate Left", ["k"], ()=>{this.p2_rot_left = true},undefined,()=>{this.p2_rot_left=false});
        this.key_triggered_button("P2 Tank Rotate Right", [";"], ()=>{this.p2_rot_right = true},undefined,()=>{this.p2_rot_right=false});
        this.key_triggered_button("P2 Shoot bullet", ["n"], () => this.shootBulletp2(this.p2_x + 1.8*Math.cos(this.p2_rot), this.p2_y + 1.8*Math.sin(this.p2_rot), this.p2_rot));
        this.key_triggered_button("Use Special", ["m"], () => this.shootShotgunp2(this.p2_x + 1.8*Math.cos(this.p2_rot), this.p2_y + 1.8*Math.sin(this.p2_rot), this.p2_rot));
        
        this.new_line();
        this.new_line();

        //Camera angles
        this.key_triggered_button("Initial Camera Position", ["Control", "0"], ()=> this.camera_mode = 0);
        this.new_line();
        this.key_triggered_button("P1 Third person persepctive", ["Control", "1"], ()=> this.camera_mode = 1);
        this.new_line();
        this.key_triggered_button("P2 Third person persepctive", ["Control", "2"], ()=> this.camera_mode = 2);
        this.new_line();
        this.key_triggered_button("Top-down persepctive", ["Control", "3"], ()=> this.camera_mode = 3);

        this.new_line();
        this.new_line();

        //Map Generation
        this.key_triggered_button("Randomly generated Map", ["["], () => this.generate_walls());
        this.new_line();
        this.key_triggered_button("Randomly pre-made Map", ["]"], () => this.pick_premade_map());
        this.new_line();
        this.key_triggered_button("Map one", ["5"], ()=> this.generate_map_1());
        this.new_line();
        this.key_triggered_button("Map two", ["6"], ()=> this.generate_map_2());
        this.new_line();
        this.key_triggered_button("Map three", ["7"], ()=> this.generate_map_3());
    }

    p1_explosion(position) {
        const newSound = this.soundEffects.explode.cloneNode();
        newSound.play();
        const num_particles = 100;
        for (let i = 0; i < num_particles; i++) {
          const velocity = vec(Math.random() - 0.5, Math.random(), Math.random() - 0.5).normalized().times(5); // Random direction
          this.particles1.push({
            position: position.copy(),
            velocity: velocity,
            lifetime: 5.0,
          });
        }
    }

    p2_explosion(position) {
        const newSound = this.soundEffects.explode.cloneNode();
        newSound.play();
        const num_particles = 100;
        for (let i = 0; i < num_particles; i++) {
          const velocity = vec(Math.random() - 0.5, Math.random(), Math.random() - 0.5).normalized().times(5); // Random direction
          this.particles2.push({
            position: position.copy(),
            velocity: velocity,
            lifetime: 5.0,
          });
        }
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

    tank_wall_collision_calc(tank_x, tank_y, tank_rot, wall_x, wall_y, wall_len, wall_wid) {
        // treat the bullet like it has a cube around it
        // pre-calculate some values
        let tank_half_length = 1;
        let tank_half_width = 1;

        // Calculate cosine and sine of tank's rotation angle
        let cos_theta = Math.cos(tank_rot);
        let sin_theta = Math.sin(tank_rot);

        // Define tank's vertices relative to its center
        let tank_vertices = [
            [-tank_half_length, -tank_half_width],  // Top-left
            [tank_half_length, -tank_half_width],   // Top-right
            [tank_half_length, tank_half_width],    // Bottom-right
            [-tank_half_length, tank_half_width]    // Bottom-left
        ];

        // Rotate tank's vertices
        let rotated_tank_vertices = tank_vertices.map(([x, y]) => [
            x * cos_theta - y * sin_theta + tank_x,
            x * sin_theta + y * cos_theta + tank_y
        ]);

        // Calculate tank's bounding box after rotation
        let tank_l = Math.min(...rotated_tank_vertices.map(([x, _]) => x));
        let tank_r = Math.max(...rotated_tank_vertices.map(([x, _]) => x));
        let tank_t = Math.max(...rotated_tank_vertices.map(([_, y]) => y));
        let tank_b = Math.min(...rotated_tank_vertices.map(([_, y]) => y));


        let wall_l = wall_x - wall_wid;
        let wall_r = wall_x + wall_wid;
        let wall_t = wall_y + wall_len;
        let wall_b = wall_y - wall_len;

        return (tank_l < wall_r && tank_r > wall_l && tank_b < wall_t && tank_t > wall_b);
    }

    //3.0;2.4
    tank_wall_collision(tank1_x, tank1_y, tank1_rot,tank2_x, tank2_y,v_walls,borderV,h_walls,borderH){
        let moveable = true;


        v_walls.forEach((wall) => {
            if (this.tank_wall_collision_calc(tank1_x, tank1_y, tank1_rot, wall[0], wall[1], 4.0, 0.15)) {
                moveable = false;
            }
        })
        borderV.forEach((wall) => {
            if (this.tank_wall_collision_calc(tank1_x, tank1_y, tank1_rot, wall[0], wall[1], 24.0, 0.15)) {
                moveable = false;
            }
        })
        h_walls.forEach((wall) => {
            if (this.tank_wall_collision_calc(tank1_x, tank1_y, tank1_rot, wall[0], wall[1], 0.15, 4.0)) {
                moveable = false;
            }
        })
        borderH.forEach((wall) => {
            if (this.tank_wall_collision_calc(tank1_x, tank1_y, tank1_rot, wall[0], wall[1], 0.15, 24.0)) {
                moveable = false;
            }
        })
        // check collision for both self and opponent tank
        if (this.tank_wall_collision_calc(tank1_x, tank1_y, tank1_rot, tank2_x, tank2_y, 1.5, 1.2)) {
            moveable = false;
        }
        
        return moveable;
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
        this.soundEffects.score.play();
        
        // manipulating light
        const light_position = vec4(0, 0, 100, 1); //changed to be higher - Nathan
        //const light_position = vec4(0, 0, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 2000)]; //changed to be a little brighter - Nathan 
        
        //Winning Page
        let winning_page_transform = Mat4.identity().times(Mat4.scale(30.0,30.0,1)).times(Mat4.translation(0,0,5));
        if(this.p2_life==0){
            this.shapes.winning_page.draw(context, program_state,winning_page_transform,this.materials.winning_mat_1);
        } else if (this.p1_life == 0){
            this.shapes.winning_page.draw(context, program_state,winning_page_transform,this.materials.winning_mat_2);
        }
        
        
        
        // generate ground for the stage - Nathan
        let floor_transform = Mat4.scale(24.0,24.0,0.2).times(Mat4.translation(0, 0, -1.0));
        this.shapes.floor.arrays.texture_coord.forEach((v,i,l) => v[0] = v[0] * 4);
        this.shapes.floor.arrays.texture_coord.forEach((v,i,l) => v[1] = v[1] * 4);
        this.shapes.floor.draw(context, program_state, floor_transform, this.materials.ground);
    
        //generate random patches of grass for the stage - Nathan
        var grasses = []
        var grass_index = 0;
        for (let y = -3; y<3; y++){
            for (let x = -3; x<3; x++){
                var base = []
                for (let i = 0; i<4; i++){
                    base[i] = Mat4.translation(8*x, 8*y, 0).times(Mat4.scale(4.0,4.0,1.8)).times(Mat4.translation(1,1,0)).times(Mat4.rotation(i*Math.PI/2.0,0,0,1));
                }
                grasses[grass_index] = base;
                grass_index++;
            }
        }
        for (let i = 0; i<this.grass_to_add.length; i++){
            for (let j = 0; j<4; j++){
                this.shapes.bush.draw(context, program_state, grasses[this.grass_to_add[i]][j], this.materials.grass.override({color:this.grass_colors[j]}));
            }
        }

        
        // generate a couple walls for the stage - Nathan
        // 0-29 VERTICAL WALLS
        const wall_transform = [];
        this.v_walls = [];
        this.h_walls = [];
        this.borderV = [];
        this.borderH = [];
        var wall_index = 0;

        for (let i = 0; i < this.particles1.length; i++) {
            const p = this.particles1[i];
            // update particle position with gravity (x = at^2 + vt + x)
            p.velocity = p.velocity.plus(this.gravity.times(dt));
            p.position = p.position.plus(p.velocity.times(dt));
            p.lifetime -= dt;
      
            this.shapes.particle.draw(context, program_state, Mat4.translation(p.position[0], p.position[1], p.position[2]).times(Mat4.scale(0.3,0.3,0.3)), this.materials.particle1);
      
            // remove particles after its lifetime
            if (p.lifetime <= 0) {
              this.particles1.splice(i, 1);
              i--; 
            }
        }

        for (let i = 0; i < this.particles2.length; i++) {
            const p = this.particles2[i];
            // update particle position with gravity (x = at^2 + vt + x)
            p.velocity = p.velocity.plus(this.gravity.times(dt));
            p.position = p.position.plus(p.velocity.times(dt));
            p.lifetime -= dt;
      
            this.shapes.particle.draw(context, program_state, Mat4.translation(p.position[0], p.position[1], p.position[2]).times(Mat4.scale(0.3,0.3,0.3)), this.materials.particle2);

            // remove particles after its lifetime
            if (p.lifetime <= 0) {
              this.particles2.splice(i, 1);
              i--; 
            }
        }
        
        const wall_height = 3.0;
       // 0-29 VERTICAL WALLS
        for (let y = -3; y<3; y++){
            for (let x = -2; x<3; x++){
                wall_transform[wall_index] = Mat4.translation(8*x,8*y,0).times(Mat4.rotation(Math.PI/2,0,0,1)).times(Mat4.scale(4.0,0.15,wall_height)).times(Mat4.translation(1, 0, 0));
                wall_index++;
            }
        }
        // 30-59 HORIZONTAL WALLS
        for (let y = -2; y<3; y++){
            for (let x = -3; x<3; x++){
                wall_transform[wall_index] = Mat4.translation(8*x,8*y,0).times(Mat4.scale(4.0,0.15,wall_height)).times(Mat4.translation(1, 0, 0));
                wall_index++;
            }
        }
        // 60-63 BORDER WALLS
        wall_transform[wall_index] = Mat4.translation(0,24,0).times(Mat4.scale(24.0,0.15,wall_height));
        wall_index++;
        wall_transform[wall_index] = Mat4.translation(0,-24,0).times(Mat4.scale(24.0,0.15,wall_height));
        wall_index++;
        wall_transform[wall_index] = Mat4.translation(24,0,0).times(Mat4.scale(0.15,24.0,wall_height));
        wall_index++;
        wall_transform[wall_index] = Mat4.translation(-24,0,0).times(Mat4.scale(0.15,24.0,wall_height));
        
        
        this.shapes.border1.arrays.texture_coord.forEach((v,i,l) => v[0] = v[0] * 6);
        this.shapes.border2.arrays.texture_coord.forEach((v,i,l) => v[1] = v[1] * 6);
        for (let i = 0; i<this.walls_to_add.length; i++){
            if(this.walls_to_add[i] == 60 || this.walls_to_add[i] == 61){
                this.shapes.border1.draw(context, program_state, wall_transform[this.walls_to_add[i]], this.materials.wall);
            }
            else if (this.walls_to_add[i] == 62 || this.walls_to_add[i] == 63){
                this.shapes.border2.draw(context, program_state, wall_transform[this.walls_to_add[i]], this.materials.wall);
            }
            else{
                this.shapes.fence.draw(context, program_state, wall_transform[this.walls_to_add[i]], this.materials.wall);
            }

            let transform = wall_transform[this.walls_to_add[i]];
            let position = vec3(transform[0][3], transform[1][3], transform[2][3]);
            if (this.walls_to_add[i] < 30) {
                this.v_walls.push(position);
            }
            else if (this.walls_to_add[i] == 62 || this.walls_to_add[i] == 63) {
                this.borderV.push(position);
            }
            else if (this.walls_to_add[i] == 60 || this.walls_to_add[i] == 61) {
                this.borderH.push(position);
            }
            else {
                this.h_walls.push(position);
            }
        }
        
        this.v_walls = this.v_walls.filter((vec, index) => {
            return this.v_walls.findIndex(otherVec => this.areVectorsEqual(vec, otherVec)) === index;
        });
        this.h_walls = this.h_walls.filter((vec, index) => {
            return this.h_walls.findIndex(otherVec => this.areVectorsEqual(vec, otherVec)) === index;
        });


        //*******TANK*******
        //Tank P1
        if (this.p1_life > 0 ) {
            if (this.p1_move_forward){
                let new_position = this.shapes.p1.position.times(Mat4.translation(this.tank1_move_speed,0,0));
                let new_x = new_position[0][3];
                let new_y = new_position[1][3];
                let moveable = this.tank_wall_collision(new_x,new_y,this.p1_rot,this.p2_x,this.p2_y,
                                                    this.v_walls,this.borderV,this.h_walls,this.borderH);
                if(moveable){
                    this.shapes.p1.position = new_position;
                }
                
            }else if (this.p1_move_backward){
                let new_position = this.shapes.p1.position.times(Mat4.translation(-this.tank1_move_speed,0,0));
                let new_x = new_position[0][3];
                let new_y = new_position[1][3];
                let moveable = this.tank_wall_collision(new_x,new_y,this.p1_rot,this.p2_x,this.p2_y,
                                                    this.v_walls,this.borderV,this.h_walls,this.borderH);
                if(moveable){
                    this.shapes.p1.position = new_position;
                }
            } 
            if (this.p1_rot_left){
                let new_position = this.shapes.p1.position.times(Mat4.rotation(this.tank1_rot_speed,0,0,1));
                let new_rot = Math.atan2(new_position[1][0],new_position[0][0]);
                let moveable = this.tank_wall_collision(this.p1_x,this.p1_y,new_rot,this.p2_x,this.p2_y,
                    this.v_walls,this.borderV,this.h_walls,this.borderH);

                if(moveable){
                    this.shapes.p1.position = new_position;
                }
            }else if (this.p1_rot_right){
                let new_position = this.shapes.p1.position.times(Mat4.rotation(-this.tank1_rot_speed,0,0,1));
                let new_rot = Math.atan2(new_position[1][0],new_position[0][0]);
                let moveable = this.tank_wall_collision(this.p1_x,this.p1_y,new_rot,this.p2_x,this.p2_y,
                    this.v_walls,this.borderV,this.h_walls,this.borderH);
                    
                if(moveable){
                    this.shapes.p1.position = new_position;
                }
            } 
            this.p1_x = this.shapes.p1.x;
            this.p1_y = this.shapes.p1.y;
            this.p1_rot = this.shapes.p1.r;
            
            let balloon_position_1 = Mat4.translation(this.p1_x+this.balloon_left_offset, this.p1_y, this.balloon_offset)
            .times(Mat4.scale(0.25,0.25,0.25));
            let balloon_position_2 = Mat4.translation(this.p1_x, this.p1_y, this.balloon_offset)
            .times(Mat4.scale(0.25,0.25,0.25));
            let balloon_position_3 = Mat4.translation(this.p1_x+this.balloon_right_offset, this.p1_y, this.balloon_offset)
            .times(Mat4.scale(0.25,0.25,0.25));


            //DRAW TANK 1
            this.shapes.p1.draw(context, program_state, this.shapes.p1.position, this.materials.tank1_mat);
            this.shapes.p1_outline.draw(context, program_state, this.shapes.p1.position, this.white, "LINES");

            if(this.p1_life>2){
                this.shapes.p1_lc_1.draw(context,program_state,balloon_position_1,this.materials.tank1_life_mat);
            }
            if(this.p1_life>1){
                this.shapes.p1_lc_2.draw(context,program_state,balloon_position_2,this.materials.tank1_life_mat);
            }
            if(this.p1_life>0){
                this.shapes.p1_lc_3.draw(context,program_state,balloon_position_3,this.materials.tank1_life_mat);
            }
            
        }
        
        //Tank P2
        if (this.p2_life > 0) {
            if (this.p2_move_forward){
                let new_position = this.shapes.p2.position.times(Mat4.translation(this.tank2_move_speed,0,0));
                let new_x = new_position[0][3];
                let new_y = new_position[1][3];
                let moveable = this.tank_wall_collision(new_x,new_y,this.p2_rot,this.p1_x,this.p1_y,
                                                    this.v_walls,this.borderV,this.h_walls,this.borderH);
                if(moveable){
                    this.shapes.p2.position = new_position;
                }
            }else if (this.p2_move_backward){
                let new_position = this.shapes.p2.position.times(Mat4.translation(-this.tank2_move_speed,0,0));
                let new_x = new_position[0][3];
                let new_y = new_position[1][3];
                let moveable = this.tank_wall_collision(new_x,new_y,this.p2_rot,this.p1_x,this.p1_y,
                                                    this.v_walls,this.borderV,this.h_walls,this.borderH);
                if(moveable){
                    this.shapes.p2.position = new_position;
                }
            } 
            if (this.p2_rot_left){
                let new_position = this.shapes.p2.position.times(Mat4.rotation(this.tank2_rot_speed,0,0,1));
                let new_rot = Math.atan2(new_position[1][0],new_position[0][0]);
                let moveable = this.tank_wall_collision(this.p2_x,this.p2_y,new_rot,this.p1_x,this.p1_y,
                    this.v_walls,this.borderV,this.h_walls,this.borderH);

                if(moveable){
                    this.shapes.p2.position = new_position;
                }
            }else if (this.p2_rot_right){
                let new_position = this.shapes.p2.position.times(Mat4.rotation(-this.tank2_rot_speed,0,0,1));
                let new_rot = Math.atan2(new_position[1][0],new_position[0][0]);
                let moveable = this.tank_wall_collision(this.p2_x,this.p2_y,new_rot,this.p1_x,this.p1_y,
                    this.v_walls,this.borderV,this.h_walls,this.borderH);

                if(moveable){
                    this.shapes.p2.position = new_position;
                }
            }
            this.p2_x = this.shapes.p2.x;
            this.p2_y = this.shapes.p2.y;
            this.p2_rot = this.shapes.p2.r;

            let balloon_position_1 = Mat4.translation(this.p2_x+this.balloon_left_offset, this.p2_y, this.balloon_offset)
            .times(Mat4.scale(0.25,0.25,0.25));
            let balloon_position_2 = Mat4.translation(this.p2_x, this.p2_y, this.balloon_offset)
            .times(Mat4.scale(0.25,0.25,0.25));
            let balloon_position_3 = Mat4.translation(this.p2_x+this.balloon_right_offset, this.p2_y, this.balloon_offset)
            .times(Mat4.scale(0.25,0.25,0.25));

            //DRAW TANK 2
            this.shapes.p2.draw(context, program_state, this.shapes.p2.position, this.materials.tank2_mat);
            this.shapes.p2_outline.draw(context, program_state, this.shapes.p2.position, this.white, "LINES");

            if(this.p2_life>2){
                this.shapes.p2_lc_1.draw(context,program_state,balloon_position_1,this.materials.tank2_life_mat);
            }
            if(this.p2_life>1){
                this.shapes.p2_lc_2.draw(context,program_state,balloon_position_2,this.materials.tank2_life_mat);
            }
            if(this.p2_life>0){
                this.shapes.p2_lc_3.draw(context,program_state,balloon_position_3,this.materials.tank2_life_mat);
            }
            
            

        }

        //Third Person perspective
        if(this.camera_mode == 1){
            program_state.set_camera(Mat4.inverse(this.shapes.p1.position.times(Mat4.rotation(-Math.PI/2, 0,1,0)).times(Mat4.rotation(-Math.PI/2, 0,0,1)).times(Mat4.translation(0,2,8))));
        }
        else if(this.camera_mode == 2){
            program_state.set_camera(Mat4.inverse(this.shapes.p2.position.times(Mat4.rotation(-Math.PI/2, 0,1,0)).times(Mat4.rotation(-Math.PI/2, 0,0,1)).times(Mat4.translation(0,2,8))));
        }
        else if(this.camera_mode == 3){
            program_state.set_camera(Mat4.look_at(vec3(0, -15, 80), vec3(0, 0, 0), vec3(0, 1, 0)));
        }
        else{
            program_state.set_camera(this.initial_camera_location);
        }

        // POWERUPS spawn every 10 seconds
        var power_coords = [];
        var power_index = 0;
        //Find every possible position a powerup can spawn at
        for (let y = -20; y<21; y+=8){
            for (let x = -20; x<21; x+=8){
                power_coords[power_index] = [x, y];
                power_index++;
            }
        }
        
        //spawn the given powerup, chosen by a random variable, this.powerup_pos[0]
        if (this.timer == 600) {
            let pos1 = power_coords[this.powerup_pos[0]][0];
            let pos2 = power_coords[this.powerup_pos[0]][1];
            let pos3 = power_coords[this.powerup_pos[1]][0];
            let pos4 = power_coords[this.powerup_pos[1]][1];
            this.powerups.push(new Powerup(pos1, pos2)); // MAKE POWERUPS SPAWN IN RANDOM LOCATIONS
            this.powerups.push(new Speed(pos3, pos4));

            this.timer = 0;
        }
        else
            this.timer += 1;
        
        for(let i = 0; i < this.powerups.length; i++) {
            if (this.bullet_wall_collision(this.powerups[i].x, this.powerups[i].y, 1.0, this.p1_x, this.p1_y, 0.8, 0.8)) {

                if (this.powerups[i] instanceof Powerup) {
                    this.p1_shotgun_mode = 1;
                    const newSound = this.soundEffects.shotgun.cloneNode();
                    newSound.play();
                }
                else {
                    this.tank1_move_speed = 0.2;
                    this.tank1_rot_speed = 0.08;
                    const newSound = this.soundEffects.speedup.cloneNode();
                    newSound.play();
                    setTimeout(() => { 
                        this.tank1_move_speed = 0.12;
                        this.tank1_rot_speed = 0.05;
                     }, this.speed_timer);
                }
                this.powerups.splice(i, 1);
    
                // handle powerup for player1
            }
            else if (this.bullet_wall_collision(this.powerups[i].x, this.powerups[i].y, 1.0, this.p2_x, this.p2_y, 0.8, 0.8)) {
                if (this.powerups[i] instanceof Powerup) {

                    this.p2_shotgun_mode = 1;
                    const newSound = this.soundEffects.shotgun.cloneNode();
                    newSound.play();
                }
                else {
                    this.tank2_move_speed = 0.2;
                    this.tank2_rot_speed = 0.08;
                    const newSound = this.soundEffects.speedup.cloneNode();
                    newSound.play();
                    setTimeout(() => { 
                        this.tank2_move_speed = 0.12;
                        this.tank2_rot_speed = 0.05;
                    }, this.speed_timer);
                }
                this.powerups.splice(i, 1);
                
                // handle powerup for player2
            }
            else {
                let pup_transform = model_transform.times(Mat4.translation(this.powerups[i].x, this.powerups[i].y, 0.5*Math.sin(2*t) + 1.5)).times(Mat4.scale(0.7,0.7,0.7));
                if (this.powerups[i] instanceof Powerup) {
                    this.shapes.powerup.draw(context, program_state, pup_transform, this.materials.powerup);
                }
                else {
                    this.shapes.powerup.draw(context, program_state, pup_transform, this.materials.speed);
                }
            }
        }

        // Draw shotgun bullets for p1
        if (this.p1_shotgun_bullets.length != 0) {
            for(let i = 0; i < this.p1_shotgun_bullets.length; i++) {
                let curBullet = this.p1_shotgun_bullets[i];
                curBullet.x = curBullet.x + (Math.cos(curBullet.rot) * curBullet.v*dt);
                curBullet.y = curBullet.y + (Math.sin(curBullet.rot) * curBullet.v*dt);
                let bullet_transform = Mat4.translation(curBullet.x, curBullet.y, 0.9).times(Mat4.scale(curBullet.rad, curBullet.rad, curBullet.rad));
                this.shapes.bullet.draw(context, program_state, bullet_transform, this.materials.bullet);
            }
        }
        // Handle collision for shotgun pellets
        for(let i = 0; i < this.p1_shotgun_bullets.length; i++) {
            let curBullet = this.p1_shotgun_bullets[i];
            this.v_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 4.0, 0.15)) {
                    this.p1_shotgun_bullets[i].change_rot(Math.PI);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.borderV.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 24.0, 0.15)) {
                    this.p1_shotgun_bullets[i].change_rot(Math.PI);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.h_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 0.15, 4.0)) {
                    this.p1_shotgun_bullets[i].change_rot(0);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.borderH.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 0.15, 24.0)) {
                    this.p1_shotgun_bullets[i].change_rot(0);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            // check collision for both self and opponent tank (RESET EVERYTHING)
            if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p2_x, this.p2_y, 0.6, 0.6)) {
                this.p2_explosion(vec(this.p2_x, this.p2_y, 0));
                this.p2_life -= 1;
                this.p2_shotgun_mode = 0;
                this.p1_shotgun_mode = 0;
                this.p2_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p2_y = 100;
                this.shapes.p2.position = Mat4.identity().times(Mat4.translation(100, 100, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                this.p1_shotgun_bullets.splice(i, 1);
                this.p1_bullet_cnt += 1;
                setTimeout(() => { 
                    this.pick_premade_map();
                    if (this.p2_life > 0){
                        this.tank1_move_speed = 0.12;
                        this.tank1_rot_speed = 0.05;
                        this.tank2_move_speed = 0.12;
                        this.tank2_rot_speed = 0.05;
                        this.p1_bullet_cnt = 5;
                        this.p2_bullet_cnt = 5;
                        this.p1_bullets = [];
                        this.p2_bullets = [];
                        this.p1_shotgun_bullets = [];
                        this.p2_shotgun_bullets = [];
                        //this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                        //this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                    }
                 }, this.round_refresh_t);
            }
            else if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p1_x, this.p1_y, 0.6, 0.6)) {
                this.p1_explosion(vec(this.p1_x, this.p1_y, 0));
                this.p1_life -= 1;
                this.p2_shotgun_mode = 0;
                this.p1_shotgun_mode = 0;
                this.p1_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p1_y = 100;
                this.shapes.p1.position = Mat4.identity().times(Mat4.translation(100, 100, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                this.p1_shotgun_bullets.splice(i, 1);
                this.p1_bullet_cnt += 1;
                setTimeout(() => { 
                    this.pick_premade_map();
                    if (this.p1_life > 0){
                        this.tank1_move_speed = 0.12;
                        this.tank1_rot_speed = 0.05;
                        this.tank2_move_speed = 0.12;
                        this.tank2_rot_speed = 0.05;
                        this.p1_bullet_cnt = 5;
                        this.p2_bullet_cnt = 5;
                        this.p1_bullets = [];
                        this.p2_bullets = [];
                        this.p1_shotgun_bullets = [];
                        this.p2_shotgun_bullets = [];
                        //this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                        //this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                    }
                 }, this.round_refresh_t);
            }
        }
        // bullets disappear after couple of seconds
        for(let i = 0; i < this.p1_shotgun_bullets.length; i++) {
            let curBullet = this.p1_shotgun_bullets[i];
            curBullet.life -= 1;
            if (curBullet.life == 0) {
                this.p1_shotgun_bullets.splice(i, 1);
                this.p1_bullet_cnt += 1;
            }   
        }

        // handle shotgun shooting for p2
        if (this.p2_shotgun_bullets.length != 0) {
            for(let i = 0; i < this.p2_shotgun_bullets.length; i++) {
                let curBullet = this.p2_shotgun_bullets[i];
                curBullet.x = curBullet.x + (Math.cos(curBullet.rot) * curBullet.v*dt);
                curBullet.y = curBullet.y + (Math.sin(curBullet.rot) * curBullet.v*dt);
                let bullet_transform = Mat4.translation(curBullet.x, curBullet.y, 0.9).times(Mat4.scale(curBullet.rad, curBullet.rad, curBullet.rad));
                this.shapes.bullet.draw(context, program_state, bullet_transform, this.materials.bullet);
            }
        }
        // Handle collision for shotgun pellets
        for(let i = 0; i < this.p2_shotgun_bullets.length; i++) {
            let curBullet = this.p2_shotgun_bullets[i];
            this.v_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 4.0, 0.15)) {
                    this.p2_shotgun_bullets[i].change_rot(Math.PI);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.borderV.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 24.0, 0.15)) {
                    this.p2_shotgun_bullets[i].change_rot(Math.PI);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.h_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 0.15, 4.0)) {
                    this.p2_shotgun_bullets[i].change_rot(0);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.borderH.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 0.15, 24.0)) {
                    this.p2_shotgun_bullets[i].change_rot(0);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            // check collision for both self and opponent tank
            if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p1_x, this.p1_y, 0.6, 0.6)) {
                this.p1_explosion(vec(this.p1_x, this.p1_y, 0));
                this.p1_life -= 1;
                this.p2_shotgun_mode = 0;
                this.p1_shotgun_mode = 0;
                this.p1_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p1_y = 100;
                this.shapes.p1.position = Mat4.identity().times(Mat4.translation(100, 100, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                this.p2_shotgun_bullets.splice(i, 1);
                this.p2_bullet_cnt += 1;
                setTimeout(() => { 
                    this.pick_premade_map();
                    if (this.p1_life > 0){
                        this.p1_bullet_cnt = 5;
                        this.p2_bullet_cnt = 5;
                        this.p1_bullets = [];
                        this.p2_bullets = [];
                        this.p1_shotgun_bullets = [];
                        this.p2_shotgun_bullets = [];
                        //this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                        //this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                    }
                 }, this.round_refresh_t);
               
            }
            else if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p2_x, this.p2_y, 0.6, 0.6)) {
                this.p2_explosion(vec(this.p2_x, this.p2_y, 0));
                this.p2_life -= 1;
                this.p2_shotgun_mode = 0;
                this.p1_shotgun_mode = 0;
                this.p2_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p2_y = 100;
                this.shapes.p2.position = Mat4.identity().times(Mat4.translation(100, 100, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                this.p2_shotgun_bullets.splice(i, 1);
                this.p2_bullet_cnt += 1;
                setTimeout(() => { 
                    this.pick_premade_map();
                    if (this.p2_life > 0){
                        this.p1_bullet_cnt = 5;
                        this.p2_bullet_cnt = 5;
                        this.p1_bullets = [];
                        this.p2_bullets = [];
                        this.p1_shotgun_bullets = [];
                        this.p2_shotgun_bullets = [];
                        //this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                        //this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                    }
                 }, this.round_refresh_t);
            }
        }
        // bullets disappear after couple of seconds
        for(let i = 0; i < this.p2_shotgun_bullets.length; i++) {
            let curBullet = this.p2_shotgun_bullets[i];
            curBullet.life -= 1;
            if (curBullet.life == 0) {
                this.p2_shotgun_bullets.splice(i, 1);
                this.p2_bullet_cnt += 1;
            }   
        }
        
        // draw the bullets for p1
        for(let i = 0; i < this.p1_bullets.length; i++) {
            let curBullet = this.p1_bullets[i];
            curBullet.x = curBullet.x + (Math.cos(curBullet.rot) * curBullet.v*dt);
            curBullet.y = curBullet.y + (Math.sin(curBullet.rot) * curBullet.v*dt);
            let bullet_transform = Mat4.translation(curBullet.x, curBullet.y, 0.9).times(Mat4.scale(curBullet.rad, curBullet.rad, curBullet.rad));
            this.shapes.bullet.draw(context, program_state, bullet_transform, this.materials.bullet);
        }
        // p1 bullet-wall & bullet-tank collision
        for(let i = 0; i < this.p1_bullets.length; i++) {
            let curBullet = this.p1_bullets[i];
            this.v_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 4.0, 0.15)) {
                    this.p1_bullets[i].change_rot(Math.PI);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.borderV.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 24.0, 0.15)) {
                    this.p1_bullets[i].change_rot(Math.PI);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.h_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 0.15, 4.0)) {
                    this.p1_bullets[i].change_rot(0);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.borderH.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 0.15, 24.0)) {
                    this.p1_bullets[i].change_rot(0);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            // check collision for both self and opponent tank
            if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p2_x, this.p2_y, 0.6, 0.6)) {
                this.p2_explosion(vec(this.p2_x, this.p2_y, 0));
                this.p2_life -= 1;
                this.p2_shotgun_mode = 0;
                this.p1_shotgun_mode = 0;
                this.p2_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p2_y = 100;
                this.shapes.p2.position = Mat4.identity().times(Mat4.translation(100, 100, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                this.p1_bullets.splice(i, 1);
                this.p1_bullet_cnt += 1;
                setTimeout(() => { 
                    this.pick_premade_map();
                    if (this.p2_life > 0){
                        this.p1_bullet_cnt = 5;
                        this.p2_bullet_cnt = 5;
                        this.p1_bullets = [];
                        this.p2_bullets = [];
                        this.p1_shotgun_bullets = [];
                        this.p2_shotgun_bullets = [];
                        //this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                        //this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                    }
                 }, this.round_refresh_t);
            }
            else if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p1_x, this.p1_y, 0.6, 0.6)) {
                this.p1_explosion(vec(this.p1_x, this.p1_y, 0));
                this.p1_life -= 1;
                this.p2_shotgun_mode = 0;
                this.p1_shotgun_mode = 0;
                this.p1_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p1_y = 100;
                this.shapes.p1.position = Mat4.identity().times(Mat4.translation(100, 100, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                this.p1_bullets.splice(i, 1);
                this.p1_bullet_cnt += 1;
                setTimeout(() => { 
                    this.pick_premade_map();
                    if (this.p1_life > 0){
                        this.p1_bullet_cnt = 5;
                        this.p2_bullet_cnt = 5;
                        this.p1_bullets = [];
                        this.p2_bullets = [];
                        this.p1_shotgun_bullets = [];
                        this.p2_shotgun_bullets = [];
                        //this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                        //this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                    }
                 }, this.round_refresh_t);
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
            let bullet_transform = Mat4.translation(curBullet.x, curBullet.y, 0.9).times(Mat4.scale(0.5, 0.5, 0.5));
            this.shapes.bullet.draw(context, program_state, bullet_transform, this.materials.bullet);
        }
        // p2 bullet-wall collision
        for(let i = 0; i < this.p2_bullets.length; i++) {
            let curBullet = this.p2_bullets[i];
            this.v_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 4.0, 0.15)) {
                    this.p2_bullets[i].change_rot(Math.PI);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.borderV.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 24.0, 0.15)) {
                    this.p2_bullets[i].change_rot(Math.PI);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.h_walls.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 0.15, 4.0)) {
                    this.p2_bullets[i].change_rot(0);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            this.borderH.forEach((wall) => {
                if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, wall[0], wall[1], 0.15, 24.0)) {
                    this.p2_bullets[i].change_rot(0);
                    const newSound = this.soundEffects.bounce.cloneNode();
                    newSound.play();
                }
            })
            // check collision for both self and opponent tank
            if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p1_x, this.p1_y, 0.6, 0.6)) {
                this.p1_explosion(vec(this.p1_x, this.p1_y, 0));
                this.p1_life -= 1;
                this.p2_shotgun_mode = 0;
                this.p1_shotgun_mode = 0;
                this.p1_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p1_y = 100;
                this.shapes.p1.position = Mat4.identity().times(Mat4.translation(100, 100, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                this.p2_bullets.splice(i, 1);
                this.p2_bullet_cnt += 1;
                setTimeout(() => { 
                    this.pick_premade_map();
                    if (this.p1_life > 0){
                        this.p1_bullet_cnt = 5;
                        this.p2_bullet_cnt = 5;
                        this.p1_bullets = [];
                        this.p2_bullets = [];
                        this.p1_shotgun_bullets = [];
                        this.p2_shotgun_bullets = [];
                        //this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                        //this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                    }
                 }, this.round_refresh_t);
            }
            else if (this.bullet_wall_collision(curBullet.x, curBullet.y, curBullet.rad, this.p2_x, this.p2_y, 0.6, 0.6)) {
                this.p2_explosion(vec(this.p2_x, this.p2_y, 0)); 
                this.p2_life -= 1;
                this.p2_shotgun_mode = 0;
                this.p1_shotgun_mode = 0;
                this.p2_x = 100;   // setting x and y to go away from the stage so that it doesnt interfere with remaining bullets
                this.p2_y = 100;
                this.shapes.p2.position = Mat4.identity().times(Mat4.translation(100, 100, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                this.p2_bullets.splice(i, 1);
                this.p2_bullet_cnt += 1;
                console.log("p2 life:" + this.p2_life);
                setTimeout(() => { 
                    this.pick_premade_map();
                    if (this.p2_life > 0){
                        this.p1_bullet_cnt = 5;
                        this.p2_bullet_cnt = 5;
                        this.p1_bullets = [];
                        this.p2_bullets = [];
                        this.p1_shotgun_bullets = [];
                        this.p2_shotgun_bullets = [];
                        //this.shapes.p2.position = Mat4.identity().times(Mat4.translation(-20, -20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                        //this.shapes.p1.position = Mat4.identity().times(Mat4.translation(20, 20, 1.5)).times(Mat4.scale(1.5,1.5,1.5));
                    }
                 }, this.round_refresh_t);
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

class Texture_ground extends Textured_Phong {
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #7.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord);
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}