import { useEffect, useRef, forwardRef } from 'react';
import Phaser from 'phaser';
import Pause from './pause';

interface GameCanvasProps {
    isPaused: boolean;
    resetTrigger: number;
}

// 1. LA CLASE DE LA ESCENA SE DEFINE FUERA DEL COMPONENTE
// Esto es más limpio y evita que se redeclare en cada renderizado.
type Player = Phaser.Physics.Arcade.Sprite & {
    facing: 'left' | 'right';
    canDash?: boolean;
    isDashing?: boolean;
};

class GameScene extends Phaser.Scene {
    
    preload() {
        this.load.spritesheet('player_idle', 'Mexico_Idle.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('player_walk', 'Mexico_Walk.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('player_kick', 'Mexico_kick.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('player_jump_n_kick', 'Mexico_jump_n_kick.png', { frameWidth: 512, frameHeight: 512 });
        this.load.image('ball', 'ball.png');
        this.load.image('background', 'Background.png');
    }

    // Usamos '!' para asegurar a TypeScript que estas propiedades serán inicializadas.
    private player1!: Player;
    private player2!: Player;

    // Controles Jugador 1
    private keysP1!: { [key: string]: Phaser.Input.Keyboard.Key };
    private spaceKey!: Phaser.Input.Keyboard.Key;
    private shiftKey!: Phaser.Input.Keyboard.Key;

    // Controles Jugador 2
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyJ!: Phaser.Input.Keyboard.Key;
    private keyK!: Phaser.Input.Keyboard.Key;

    private ball!: Phaser.Physics.Arcade.Sprite;
    private scoreLeft: number = 0;
    private scoreRight: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private goalText!: Phaser.GameObjects.Text;


    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.physics.world.gravity.y = 2400;

        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 50);
        this.add.rectangle(this.scale.width / 2, this.scale.height - 25, this.scale.width, 50, 0x228B22);

        // Jugador 1 (Rojo)
        this.player1 = this.physics.add.sprite(this.scale.width * 0.25, this.scale.height / 1.2, 'player_idle') as Player & { facing: 'left' | 'right' };
        this.player1.setSize(320, 512).setDisplaySize(256, 256);
        this.player1.setCollideWorldBounds(true);
        this.player1.setMass(100);
        this.player1.setDamping(true);
        this.player1.setDrag(1);
        this.player1.facing = 'right';
        this.player1.canDash = true; this.player1.isDashing = false;

        // Jugador 2 (Azul)
        this.player2 = this.physics.add.sprite(this.scale.width * 0.75, this.scale.height / 1.2, 'player_idle') as Player & { facing: 'left' | 'right' };
        this.player2.setSize(320, 512).setDisplaySize(256, 256);
        this.player2.setCollideWorldBounds(true).setMass(100);
        this.player2.setDamping(true);
        this.player2.setDrag(1);
        this.player2.facing = 'left';
        this.player2.setFlipX(true);
        this.player2.canDash = true; this.player2.isDashing = false;

        // Balón
        this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 3, 'ball') as Phaser.Physics.Arcade.Sprite;
        this.ball.setSize(100, 100).setDisplaySize(80, 80);
        this.ball.setCircle(50);
        this.ball.setCollideWorldBounds(true).setBounce(0.7).setMass(100).setDrag(50, 50);
        this.ball.setFriction(200);

        // Fondo
        const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
        bg.setDisplaySize(this.scale.width, this.scale.height);
        bg.setDepth(-1);

        // --- ANIMACIONES ---
        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 23 }), frameRate: 24, repeat: -1 });
        this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 14 }), frameRate: 24, repeat: -1 });
        this.anims.create({ key: 'kick', frames: this.anims.generateFrameNumbers('player_kick', { start: 1, end: 11 }), frameRate: 24, repeat: 0 });
        this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('player_jump_n_kick', { start: 1, end: 8 }), frameRate: 24, repeat: 0 });
        this.anims.create({ key: 'jump_kick', frames: this.anims.generateFrameNumbers('player_jump_n_kick', { start: 10, end: 18 }), frameRate: 24, repeat: 0 });


        // --- CREACIÓN DE PORTERÍAS Y MARCADOR ---
        // Portería Izquierda (invisible)
        const goalLeft = this.add.zone(25, this.scale.height - 175, 50, 250);
        this.physics.world.enable(goalLeft);
        (goalLeft.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        // Portería Derecha (invisible)
        const goalRight = this.add.zone(this.scale.width - 25, this.scale.height - 175, 50, 250);
        this.physics.world.enable(goalRight);
        (goalRight.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        // Marcador
        this.scoreText = this.add.text(this.scale.width / 2, 50, '0 - 0', {
            fontSize: '64px',
            fontFamily: '"Arial Black"',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Mensaje de Gol (inicialmente invisible)
        this.goalText = this.add.text(this.scale.width / 2, this.scale.height / 2, '¡GOOOOL!', {
            fontSize: '128px',
            fontFamily: '"Arial Black"',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5).setVisible(false).setDepth(10);

        // --- COLISIONES ---
        const players = [this.player1, this.player2];
        this.physics.add.collider(players, this.ball, undefined, this.handlePlayerBallCollide as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, this);
        this.physics.add.collider(this.player1, this.player2);

        // Detectores de gol
        this.physics.add.overlap(this.ball, goalLeft, () => this.handleGoal('right'));
        this.physics.add.overlap(this.ball, goalRight, () => this.handleGoal('left'));


        // --- CONTROLES ---
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.keysP1 = this.input.keyboard!.addKeys('W,A,D,SHIFT') as any;
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.keyJ = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.keyK = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    }

    // --- FUNCIONES PARA EL PARTIDO ---
    private handleGoal(scoringSide: 'left' | 'right') {
        // Evita que se marquen múltiples goles a la vez
        if (!this.ball.active) return;
        this.ball.setActive(false); // Desactivamos el balón temporalmente

        if (scoringSide === 'left') {
            this.scoreLeft++;
        } else {
            this.scoreRight++;
        }

        this.scoreText.setText(`${this.scoreLeft} - ${this.scoreRight}`);

        // Animación del texto de gol
        this.goalText.setVisible(true);
        this.tweens.add({
            targets: this.goalText,
            scale: { from: 0.5, to: 1.2 },
            alpha: { from: 0.5, to: 1 },
            ease: 'Power2',
            duration: 500,
            yoyo: true, // La animación va y vuelve
            onComplete: () => this.goalText.setVisible(false)
        });

        // Después de 2 segundos, reseteamos la posición del balón
        this.time.delayedCall(2000, () => {
            this.resetPositions();
        });
    }

    private resetPositions() {
        this.ball.setPosition(this.scale.width / 2, this.scale.height / 3).setVelocity(0, 0);
        this.player1.setPosition(this.scale.width * 0.25, this.scale.height / 1.2).setVelocity(0, 0);
        this.player2.setPosition(this.scale.width * 0.75, this.scale.height / 1.2).setVelocity(0, 0);
        this.ball.setActive(true);
    }

    public resetGame() {
        this.scoreLeft = 0;
        this.scoreRight = 0;
        this.scoreText.setText('0 - 0');
        this.resetPositions();
    }


    private handlePlayerBallCollide(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        ball: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ): boolean {
        const playerSprite = player as Phaser.Physics.Arcade.Sprite & { facing: 'left' | 'right' };
        const ballSprite = ball as Phaser.Physics.Arcade.Sprite;

        // --- Regla 1: Anti-Entierro ---
        const playerIsOnTop = playerSprite.y + playerSprite.height / 2 < ballSprite.y - 10;
        const playerIsFalling = playerSprite.body!.velocity.y > 50;

        // Si el jugador está cayendo encima del balón...
        if (playerIsOnTop && playerIsFalling) {
            // ...le damos un empujón al balón en la dirección que mira el jugador.
            const pushDirectionX = playerSprite.facing === 'right' ? 150 : -150;
            ballSprite.body!.velocity.x += pushDirectionX;

            // Y rebotamos ligeramente al jugador para que no se "pegue"
            playerSprite.body!.velocity.y *= -0.2;

            return false;
        }

        // --- Regla 2: Anti-Sándwich ---
        // Determinamos quién es el "otro" jugador
        const otherPlayer = playerSprite === this.player1 ? this.player2 : this.player1;
        // Calculamos la distancia entre el balón y el OTRO jugador
        const distanceToOtherPlayer = Phaser.Math.Distance.Between(ballSprite.x, ballSprite.y, otherPlayer.x, otherPlayer.y);

        // Si el otro jugador está muy cerca (umbral de "sándwich")
        if (distanceToOtherPlayer < 180) {
            // Le decimos a Phaser que ignore su física por defecto

            // Aplicamos nuestra propia física: un fuerte impulso hacia arriba para escapar.
            ballSprite.body!.velocity.y = -1800;
            // Damos un pequeño empujón horizontal aleatorio para que no sea predecible
            ballSprite.body!.velocity.x += Phaser.Math.Between(-200, 200);

            // Ignoramos la colisión normal para evitar el tunneling
            return false;
        }

        // Para todas las demás colisiones (laterales, etc.), dejamos que Phaser las maneje.
        return true;
    }

    // FUNCIÓN PARA LA LÓGICA DEL DASH
    private performDash(player: Player) {
        if (!player.canDash) return;
        player.canDash = false; player.isDashing = true;

        const dashSpeed = player.body!.blocked.down ? 1000 : 1600;
        const dashVelocity = player.facing === 'right' ? dashSpeed : -dashSpeed;
        player.setVelocity(dashVelocity, 0);

        // Efecto de estela mejorado
        this.time.addEvent({
        delay: 40,
        repeat: 5,
        callback: () => {
            // 1. CAPTURAMOS EL ESTADO ACTUAL DEL JUGADOR
            const currentTextureKey = player.texture.key; // Ej: 'player_walk'
            const currentFrameName = player.frame.name;   // Ej: 3
            const currentFlipX = player.flipX;
            const currentTint = player.tintTopLeft; // El tint del sprite se guarda aquí

            // 2. CREAMOS EL FANTASMA USANDO LA "FOTO" QUE TOMAMOS
            const ghost = this.add.sprite(player.x, player.y, currentTextureKey, currentFrameName)
                .setTint(currentTint)
                .setAlpha(0.3)
                .setDisplaySize(player.displayWidth, player.displayHeight) 
                .setFlipX(currentFlipX);

            // 3. ANIMAMOS LA DESAPARICIÓN DEL FANTASMA
            this.tweens.add({
                targets: ghost,
                alpha: 0,
                duration: 400,
                onComplete: () => ghost.destroy()
            });
        }
    });

        this.time.delayedCall(250, () => { player.isDashing = false; });
        this.time.delayedCall(1000, () => { player.canDash = true; });
    }

    private performKick(player: Player, ball: Phaser.Physics.Arcade.Sprite) {
        const kickPosX = player.facing === 'right' ? player.x + 110 : player.x - 110;
        const kickPosY = player.y + 80;
        const kickZone = this.add.zone(kickPosX, kickPosY, 60, 100);
        this.physics.world.enable(kickZone);
        (kickZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        const overlap = this.physics.add.overlap(kickZone, ball, (_zone, b) => {
            const ballSprite = b as Phaser.Physics.Arcade.Sprite;
            const impactEffect = this.add.circle(ballSprite.x, ballSprite.y, 10, 0xffffff, 0.8);
            this.tweens.add({ targets: impactEffect, radius: 40, alpha: 0, duration: 200, onComplete: () => { impactEffect.destroy(); } });
            const angle = Phaser.Math.Angle.Between(player.x, player.y, ballSprite.x, ballSprite.y);
            this.physics.velocityFromRotation(angle, 1400, ballSprite.body!.velocity);
            overlap.destroy();
        });
        this.time.delayedCall(100, () => { kickZone.destroy(); });
    }


    update() {
        this.handlePlayerControls(this.player1, this.keysP1, this.spaceKey, this.shiftKey);
        this.handlePlayerControls(this.player2, this.cursors, this.keyK, this.keyJ);

    }

    handlePlayerControls(
        player: Player,
        keys: { [key: string]: Phaser.Input.Keyboard.Key } | Phaser.Types.Input.Keyboard.CursorKeys,
        kickKey: Phaser.Input.Keyboard.Key,
        dashKey: Phaser.Input.Keyboard.Key
    ) {
        if (player.isDashing) return; // Si está en dash, no hacer nada más

        const onGround = player.body!.blocked.down;

        // Determina las teclas de movimiento según el tipo de objeto 'keys'
        let leftKey: Phaser.Input.Keyboard.Key | undefined;
        let rightKey: Phaser.Input.Keyboard.Key | undefined;
        let upKey: Phaser.Input.Keyboard.Key | undefined;

        if ('A' in keys && 'D' in keys && 'W' in keys) {
            // Custom key mapping (Jugador 1)
            leftKey = keys['A'];
            rightKey = keys['D'];
            upKey = keys['W'];
        } else {
            // Cursor keys (Jugador 2)
            leftKey = (keys as Phaser.Types.Input.Keyboard.CursorKeys).left;
            rightKey = (keys as Phaser.Types.Input.Keyboard.CursorKeys).right;
            upKey = (keys as Phaser.Types.Input.Keyboard.CursorKeys).up;
        }


         // --- LÓGICA DE MOVIMIENTO (INSPIRADA EN TU CÓDIGO ORIGINAL) ---
        // Esta sección se encarga únicamente de la velocidad.
        if (leftKey.isDown) {
            player.setVelocityX(-400).setFlipX(true);
            player.facing = 'left';
        } else if (rightKey.isDown) {
            player.setVelocityX(400).setFlipX(false);
            player.facing = 'right';
        } else {
            player.setVelocityX(0);
        }

        // --- ESTADOS DE ANIMACIÓN ---
        // Esta sección se encarga únicamente de decidir qué animación mostrar.
        const currentAnim = player.anims.currentAnim?.key;
        if (['kick', 'jump_kick', 'jump'].includes(currentAnim || '') && player.anims.isPlaying) {
            // No hacemos nada, dejamos que la animación actual continúe.
        } else {
            if (onGround) {
                if (leftKey.isDown || rightKey.isDown) {
                    player.play('walk', true);
                } else {
                    player.play('idle', true);
                }
            } else {
                player.play({ key: 'jump' });
                player.anims.setProgress(1) // Detiene el último frame
            }
        }
        // --- LÓGICA DE SALTO ---
        if (upKey && upKey.isDown && onGround) {
            player.setVelocityY(-900);
            player.play('jump', true); 
        }
        // --- LÓGICA DE ACCIONES (EVENTOS DE UN SOLO PULSO) ---
        if (Phaser.Input.Keyboard.JustDown(kickKey)) {
            player.play(onGround ? 'kick' : 'jump_kick', true);
            this.performKick(player, this.ball);
        }

        if (Phaser.Input.Keyboard.JustDown(dashKey)) {
            this.performDash(player);
        }
    }

}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(({ isPaused, resetTrigger }, ref) => {
    const gameRef = useRef<Phaser.Game | null>(null);
     <Pause />

    // useEffect para crear y destruir el juego
    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.CANVAS,
            width: 1920,
            height: 1080,
            parent: 'phaser-container',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                    fps: 60,
                },
            },
            // Le damos un fondo transparente para que se vea el gradiente de App.tsx
            transparent: true,
            scene: [GameScene],
        };

        gameRef.current = new Phaser.Game(config);

        // Pasamos la ref del canvas creado por Phaser al componente padre
        if (ref && 'current' in ref) {
            ref.current = gameRef.current.canvas;
        }

        return () => {
            gameRef.current?.destroy(true);
        };
    }, [ref]);

    // useEffect para manejar la pausa
    useEffect(() => {
        if (gameRef.current?.scene) {
            if (isPaused) {
                gameRef.current.scene.pause('GameScene');
            } else {
                gameRef.current.scene.resume('GameScene');
            }
        }
    }, [isPaused]);

    // useEffect para manejar el reseteo del juego
    useEffect(() => {
        // No queremos resetear en la carga inicial (trigger === 0)
        if (resetTrigger > 0 && gameRef.current) {
            const scene = gameRef.current.scene.getScene('GameScene') as GameScene;
            if (scene) {
                scene.resetGame();
            }
        }
    }, [resetTrigger]); // Se ejecuta cada vez que el trigger cambia


    // El componente ya no renderiza el canvas, Phaser lo hará por él.
    return null;
});

export default GameCanvas;