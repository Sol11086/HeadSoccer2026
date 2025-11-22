/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { useEffect, useRef, useState, forwardRef } from 'react';
import Phaser from 'phaser';
import Pause from './pause';
import GameOverModal from './GameOverModal';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import { Characters } from '../data/Characters'

import { motion, AnimatePresence } from "framer-motion";



interface GameCanvasProps {
    isPaused: boolean;
    resetTrigger: number;
}

declare module 'phaser' {
    namespace Loader {
        interface LoaderPlugin {
            spine(key: string, jsonURL: string, atlasURL: string | string[], preMultipliedAlpha?: boolean): void;
        }
    }
    namespace GameObjects {
        interface GameObjectFactory {
            spine(x: number, y: number, key: string, animationName?: string, loop?: boolean): SpineGameObject;
        }
    }
}

interface SpineGameObject extends Phaser.GameObjects.Container {
    play(animationName: string, loop?: boolean, ignoreIfPlaying?: boolean): void;
    setAnimation(trackIndex: number, animationName: string, loop?: boolean, ignoreIfPlaying?: boolean): void;
    setSkinByName(skinName: string): void;
    setSkin(newSkin: any): void;
    skeleton: any;
    timescale: number;
    state: any;
    scaleX: number;
}

declare global {
    interface Window {
        SpinePlugin: any;
    }
}

// 1. LA CLASE DE LA ESCENA SE DEFINE FUERA DEL COMPONENTE
// Esto es más limpio y evita que se redeclare en cada renderizado.
type Player = Phaser.Physics.Arcade.Sprite & {
    facing: 'left' | 'right';
    canDash?: boolean;
    isDashing?: boolean;
};

class GameScene extends Phaser.Scene {

    // Estado
    public onGameOver?: (winner: string, scoreLeft: number, scoreRight: number) => void;

    private player1!: Player;
    private player1Armature!: any;
    private player2!: Player;
    private player2Armature!: any;

    // Timer
    private gameTimer!: Phaser.Time.TimerEvent;
    private timeLeft: number = 60; // 60 Segundos
    private timerText!: Phaser.GameObjects.Text;
    private isMatchOver: boolean = false;

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

    preload() {
        this.load.setPath('/assets/anim/');
        this.load.image('Players_Animations_Spine_tex.png', 'Players_Animations_Spine_tex.png');

        // Carga de modelos SPINE
        this.load.spine('player_anim', 'Players_Animations_Spine_ske.json', ['Players_Animations_Spine_tex.atlas'], false);

        this.load.setPath('/');// Regresamos al path base o usamos rutas absolutas abajo
        this.load.image('ball', 'ball.png'); // Ajusta la ruta si es necesario
        this.load.image('background', 'Background.png');
        this.load.image('goal', 'Goal.png');
    }

    create() {

        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height - 50);
        this.add.rectangle(this.scale.width / 2, this.scale.height - 25, this.scale.width, 50, 0x228B22);

        const p1SkinName = this.registry.get('p1Skin');
        const p2SkinName = this.registry.get('p2Skin');

        console.log(`Iniciando partido: ${p1SkinName} VS ${p2SkinName}`);

        // A) Jugador 1 - Cuerpo Físico (Invisible)
        this.player1 = this.physics.add.sprite((this.scale.width * 0.25), this.scale.height / 1.2, 'ball') as Player & { facing: 'left' | 'right' };
        this.player1.setVisible(false); // Lo ocultamos, solo nos importa su física
        this.player1.setSize(110, 200); // Tamaño de la hitbox
        this.player1.setCollideWorldBounds(true).setMass(100);
        this.player1.setDamping(true);
        this.player1.setDrag(1);
        this.player1.facing = 'right';
        this.player1.canDash = true; this.player1.isDashing = false;

        // B) Armadura Visual (Spine)
        this.player1Armature = this.add.spine((this.scale.width * 0.25), this.scale.height / 1.2, 'player_anim', 'Idle', true);
        this.player1Armature.x = this.player1.x;
        this.player1Armature.y = this.player1.y; // Ajuste vertical si flota
        this.player1Armature.setScale(0.4); // Ajusta la escala si sale gigante
        this.player1Armature.setSkinByName('default');
        this.player1Armature.setSlotsToSetupPose();
        this.applySkinToSkeleton(this.player1Armature.skeleton, p1SkinName);


        // Jugador 2 - Cuerpo Físico (Invisible)
        this.player2 = this.physics.add.sprite((this.scale.width * 0.75), this.scale.height / 1.2, 'ball') as Player & { facing: 'left' | 'right' };
        this.player2.setVisible(false); // Lo ocultamos, solo nos importa su física
        this.player2.setSize(110, 200); // Tamaño de la hitbox
        this.player2.setCollideWorldBounds(true).setMass(100);
        this.player2.setDamping(true);
        this.player2.setDrag(1);
        this.player2.facing = 'left';
        this.player2.canDash = true; this.player2.isDashing = false;

        // B) Armadura Visual (Spine)
        this.player2Armature = this.add.spine((this.scale.width * 0.75), this.scale.height / 1.2, 'player_anim', 'Idle', true);
        this.player2Armature.x = this.player2.x;
        this.player2Armature.y = this.player2.y + 0; // Ajuste vertical si flota
        this.player2Armature.scaleX = -0.4;
        this.player2Armature.scaleY = 0.4;   // Flip en SPINE con escala negativa
        this.player2Armature.setSkinByName('default');
        this.player2Armature.setSlotsToSetupPose();
        this.applySkinToSkeleton(this.player2Armature.skeleton, p2SkinName);

        // 1. Activar depuración visual
        // (Esto dibuja huesos, nombres de slots y bordes)
        this.player1Armature.drawDebug = true;
        this.player2Armature.drawDebug = true;

        // 2. Imprimir en consola qué demonios tiene cargado el esqueleto
        console.log("--- DIAGNÓSTICO SPINE ---");
        console.log("Skins disponibles:", this.player1Armature.skeleton.data.skins.map((s: any) => s.name));
        console.log("Slots disponibles:", this.player1Armature.skeleton.data.slots.map((s: any) => s.name));
        this.physics.world.gravity.y = 2400;

        // Balón
        this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 3, 'ball') as Phaser.Physics.Arcade.Sprite;
        this.ball.setSize(100, 100).setDisplaySize(60, 60);
        this.ball.setCircle(50);
        this.ball.setCollideWorldBounds(true).setBounce(0.7).setMass(100).setDrag(50, 50);
        this.ball.setFriction(200);

        // Porterías
        this.add.image(-5, this.scale.height - 225, 'goal').setScale(1).setDisplaySize(280, 360).setFlipX(true);
        this.add.image(this.scale.width + 5, this.scale.height - 225, 'goal').setScale(1).setDisplaySize(280, 360).setFlipX(false);

        // Fondo
        const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
        bg.setDisplaySize(this.scale.width, this.scale.height);
        bg.setDepth(-1);

        // --- CREACIÓN DE PORTERÍAS Y MARCADOR ---
        // Portería Izquierda (invisible)
        const goalLeft = this.add.zone(40, this.scale.height - 210, 80, 320);
        this.physics.world.enable(goalLeft);
        (goalLeft.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        // Travesaño Izquierdo (invisible)
        const crossbarLeft = this.add.zone(40, this.scale.height - 390, 120, 20);
        this.physics.world.enable(crossbarLeft);
        (crossbarLeft.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true);

        // Portería Derecha (invisible)
        const goalRight = this.add.zone(this.scale.width - 40, this.scale.height - 210, 80, 320);
        this.physics.world.enable(goalRight);
        (goalRight.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        // Travesaño Derecho (invisible)
        const crossbarRight = this.add.zone(this.scale.width - 40, this.scale.height - 390, 120, 20);
        this.physics.world.enable(crossbarRight);
        (crossbarRight.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true);

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
        this.physics.add.collider(this.ball, [crossbarLeft, crossbarRight], this.handleCrossbarCollide as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

        // Detectores de gol
        this.physics.add.overlap(this.ball, goalLeft, () => this.handleGoal('right'));
        this.physics.add.overlap(this.ball, goalRight, () => this.handleGoal('left'));

        // --- CONTROLES ---
        this.keysP1 = this.input.keyboard!.addKeys('W,A,D,SHIFT') as any;
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.keyJ = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.keyK = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // --- INICIAR EL RELOJ DEL PARTIDO ---
        this.isMatchOver = false;
        this.setupTimer();

    }

    // --- FUNCIONES PARA EL PARTIDO ---

    private setupTimer() {
        if (this.timerText) {
            this.timerText.destroy();
        }

        this.timeLeft = 60;
        this.timerText = this.add.text(this.scale.width / 2, 120, '01:00', {
            fontSize: '48px',
            fontFamily: '"Arial Black"',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        if (this.gameTimer) this.gameTimer.remove();

        // Evento que se dispara cada 1 segundo
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.onSecondTick,
            callbackScope: this,
            loop: true
        });
    }

    private onSecondTick() {
        if (this.isMatchOver) return;

        this.timeLeft--;

        // Formatear texto mm:ss
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const segString = seconds < 10 ? `0${seconds}` : `${seconds}`;
        this.timerText.setText(`0${minutes}:${segString}`);

        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    private endGame() {
        this.isMatchOver = true;
        this.gameTimer.remove(); // Detener reloj
        this.physics.pause();    // Congelar físicas

        this.player1Armature.timeScale = 0;
        this.player2Armature.timeScale = 0;

        // Determinar ganador
        let result = "¡EMPATE!";
        if (this.scoreLeft > this.scoreRight) result = "¡GANA JUGADOR 1!";
        if (this.scoreRight > this.scoreLeft) result = "¡GANA JUGADOR 2!";

        // Avisar a React
        if (this.onGameOver) {
            this.onGameOver(result, this.scoreLeft, this.scoreRight);
        }
    }

    private handleGoal(scoringSide: 'left' | 'right') {
        // Evita que se marquen múltiples goles a la vez
        if (!this.ball.active) return;
        // Pausar timer
        this.gameTimer.paused = true;
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
        // Reanudar Timer
        this.gameTimer.paused = false;
    }

    public resetGame() {
        this.scoreLeft = 0;
        this.scoreRight = 0;
        this.scoreText.setText('0 - 0');
        this.isMatchOver = false;
        this.physics.resume();

        this.player1Armature.timeScale = 1;
        this.player2Armature.timeScale = 1;

        // Reiniciar Timer
        this.gameTimer.remove();
        this.setupTimer();
        this.resetPositions();
    }

    private handleCrossbarCollide(
        crossbar: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        ball: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) {
        const crossbarBody = crossbar.body as Phaser.Physics.Arcade.Body;
        const ballBody = ball.body as Phaser.Physics.Arcade.Body;
        const crossbarY = crossbarBody.y;
        const crossbarX = crossbarBody.x;
        const crossbarHalfWidth = (crossbarBody && crossbarBody.width) ? crossbarBody.width / 2 : 0;

        const isComingFromAbove = ballBody.velocity.y > 0 && (ballBody.bottom <= crossbarY);
        const isHorizontallyOver = Math.abs((ball as any).x - crossbarX) <= (crossbarHalfWidth + 40);

        if (isComingFromAbove && isHorizontallyOver) {
            // Rebote hacia arriba
            ballBody.velocity.y = -800;
            const horizontalPush = ((ball as any).x < crossbarX) ? -300 : 300;
            ballBody.velocity.x += horizontalPush;
        }

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
    private performDash(player: Player, spineSource: SpineGameObject) {
        if (!player.canDash) return;
        player.canDash = false; player.isDashing = true;

        const dashSpeed = player.body!.blocked.down ? 1000 : 1600;
        const dashVelocity = player.facing === 'right' ? dashSpeed : -dashSpeed;
        player.setVelocity(dashVelocity, 0);

        const skinKey = (player === this.player1)
            ? (this.registry.get('p1Skin') || "Santi")
            : (this.registry.get('p2Skin') || "Gio");

        // Efecto de estela mejorado
        this.time.addEvent({
            delay: 40,
            repeat: 5,
            callback: () => {
                // Clona el estado visual actual
                const ghost = this.add.spine(player.x, player.y + 10, 'player_anim', spineSource.state.getCurrent(0).animation.name, false);
                ghost.setScale(spineSource.scaleX, spineSource.scaleY); // Copia dirección y tamaño

                this.applySkinToSkeleton(ghost.skeleton, skinKey);

                ghost.setAlpha(0.5);
                ghost.setDepth(-1);

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

    private applySkinToSkeleton(skeleton: any, skinKey: string) {

        // DICCIONARIO MAESTRO: Define qué prefijo usa cada personaje en el Atlas.
        const prefixMap: { [key: string]: string } = {
            "Santi": "S_",
            "Gio": "G_",
            "Alponso": "A_", // Futuro
            "Endrick": "E_", // Futuro
            "Musa": "M_", // Futuro
            "Cho": "C_"  // Futuro
        };

        // Obtener prefijo (Fallback a G_ si no existe para evitar crash)
        const prefix = prefixMap[skinKey] || "G_";
        console.log(`🔍 Aplicando Skin: ${skinKey} | Prefijo: ${prefix}`);
        const mappings = [
            { slot: "G_Cabeza", suffix: "Cabeza" },
            { slot: "G_Cuerpo", suffix: "Cuerpo" },
            { slot: "G_Mano_Derecha", suffix: "Mano_Derecha" },
            { slot: "G_Mano_Izquierda", suffix: "Mano_Izquierda" },
            { slot: "G_Tenis_Derecho", suffix: "Tenis_Derecho" },
            { slot: "G_Tenis_Izquierdo", suffix: "Tenis_Izquierdo" }
        ];

        mappings.forEach(map => {
            const attachmentName = prefix + map.suffix;
            try {
                const slotIndex = skeleton.findSlotIndex(map.slot);
                const slot = skeleton.slots[slotIndex];
                if (slot) {
                    const attachment = skeleton.getAttachment(skeleton.findSlotIndex(map.slot), attachmentName);
                    if (attachment) {
                        slot.setAttachment(attachment);
                    }
                }
            } catch (e) { console.error(`Error al asignar ${attachmentName} en slot ${map.slot}:`, e); }
        });
    }


    update() {
        if (!this.player1 || !this.player1Armature) return;

        this.player1Armature.x = this.player1.x;
        this.player1Armature.y = this.player1.y + 25;

        this.player2Armature.x = this.player2.x;
        this.player2Armature.y = this.player2.y + 25;

        this.handlePlayerControls(this.player1, this.player1Armature, this.keysP1, this.spaceKey, this.shiftKey);
        this.handlePlayerControls(this.player2, this.player2Armature, this.cursors, this.keyK, this.keyJ);

    }

    handlePlayerControls(
        player: Player,
        spine: SpineGameObject,
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


        // --- LÓGICA DE MOVIMIENTO ---
        const scaleAbs = Math.abs(spine.scaleX);

        if (leftKey.isDown) {
            player.setVelocityX(-400).setFlipX(true);
            player.facing = 'left';
            spine.scaleX = -scaleAbs;
        } else if (rightKey.isDown) {
            player.setVelocityX(400).setFlipX(false);
            player.facing = 'right';
            spine.scaleX = scaleAbs;
        } else {
            player.setVelocityX(0);
        }

        // --- ANIMACIONES ---
        const currentEntry = spine.state.getCurrent(0);
        const currentAnim = currentEntry ? currentEntry.animation.name : "";
        const isActionPlaying = (['Kick', 'Jump', 'Jump_Kick'].includes(currentAnim)) && !currentEntry.isComplete();

        // Lógica simple de estados:
        if (Phaser.Input.Keyboard.JustDown(kickKey)) {
            const attackAnim = onGround ? 'Kick' : 'Jump_Kick';
            // Play(nombre, loop)
            spine.play(attackAnim, false);
            this.performKick(player, this.ball);
        }
        else if (upKey.isDown && onGround) {
            player.setVelocityY(-800);
            spine.play('Jump', false);
        }
        else if (!isActionPlaying) {
            if (onGround) {
                if (player.body!.velocity.x !== 0) {
                    spine.play('Walk', true, true); // IgnoreIfPlaying = true 
                } else {
                    spine.play('Idle', true, true);
                }
            }
        }

        // Dash
        if (Phaser.Input.Keyboard.JustDown(dashKey)) {
            this.performDash(player, spine);
        }
    }

}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(({ isPaused, resetTrigger }, ref) => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const [sceneInstance, setSceneInstance] = useState<GameScene | null>(null);
    const navigate = useNavigate();
    const [gameOverData, setGameOverData] = useState<{ winner: string, score: string } | null>(null);
    const [coinsEarned, setCoinsEarned] = useState<number>(0);
    const [showAchievementToast, setShowAchievementToast] = useState(false);
    const [achievementName, setAchievementName] = useState("");

    const location = useLocation();

    // Recuperar la selección (o usar default si entran directo)
    const p1Skin = location.state?.p1Skin || "default";
    const p2Skin = location.state?.p2Skin || "default";

    <Pause />

    // useEffect para crear y destruir el juego
    useEffect(() => {
        if (!window.SpinePlugin) {
            console.error("El plugin de Spine no está cargado en window. Revisa index.html");
            return;
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
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
            transparent: true,
            plugins: {
                scene: [
                    {
                        key: 'SpinePlugin',
                        plugin: window.SpinePlugin,
                        mapping: 'spine'
                    }
                ]
            },
            scene: [GameScene],
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;
        game.registry.set('p1Skin', p1Skin);
        game.registry.set('p2Skin', p2Skin);

        game.events.on('ready', () => {
            const scene = game.scene.getScene('GameScene') as GameScene;
            setSceneInstance(scene);

            scene.onGameOver = async (winner, scoreLeft, scoreRight) => {

                const p1Skin = location.state?.p1Skin || "Santi";
                const p2Skin = location.state?.p2Skin || "Gio"; // Rival

                const characterObj = Characters.find(c => c.skinKey === p1Skin);
                const idPersonaje = characterObj ? characterObj.id : 1; // Fallback ID 1

                let resultadoDB = 'Empate';

                if (winner.includes("JUGADOR 1")) {
                    resultadoDB = 'Ganado';
                } else if (winner.includes("JUGADOR 2")) {
                    resultadoDB = 'Perdido';
                }

                try {
                    const partidoData = {
                        id_personaje: idPersonaje,
                        nivel: 1,
                        jugador_2: p2Skin,
                        resultado: resultadoDB,
                        monedas: 20,
                        goles_favor: scoreLeft,
                        goles_contra: scoreRight
                    };

                    // Registrar Partido
                    await apiService.post('/partidos', partidoData);

                    const userStr = localStorage.getItem('user');
                    if (userStr) {
                        const userJson = JSON.parse(userStr);
                        const userId = userJson.usuario?.id_usuario || userJson.id_usuario;

                        const rewardResp = await apiService.post('/usuarios/recompensa', {
                            id_usuario: userId,
                            cantidad: 20
                        });

                        if (!rewardResp.data.success) {
                            setCoinsEarned(20);

                            // Actualizar Storage para que el Navbar lo refleje
                            let updatedUser = { ...userJson };
                            if (updatedUser.usuario) updatedUser.usuario = rewardResp.data.body.usuario;
                            else updatedUser = rewardResp.data.body.usuario;

                            localStorage.setItem('user', JSON.stringify(updatedUser));
                            window.dispatchEvent(new Event("storage"));
                        }
                    }
                    // --- LÓGICA DE LOGROS ---
                    const checkLogros = async () => {
                        const logrosCumplidos = [];

                        let gano = false;
                        if (winner.includes("JUGADOR 1")) { resultadoDB = 'Ganado'; gano = true; }

                        // Logro 1: Primera Victoria 
                        if (gano) logrosCumplidos.push(1);
                        // Logro 2: Goleador (5+ goles)
                        if (scoreLeft >= 5) logrosCumplidos.push(2);
                        // Logro 3: Invicto (Ganar y recibir 0 goles)
                        if (gano && scoreRight === 0) logrosCumplidos.push(3);
                        if (scoreLeft >= 10) logrosCumplidos.push(5); // Maestro del balón

                        // Logro 4: "Entusiasta" (20 partidas)
                        try {
                            const historialResp = await apiService.get('/partidos');
                            if (!historialResp.data.error) {
                                const totalPartidos = historialResp.data.body.length;
                                if (totalPartidos >= 20) {
                                    logrosCumplidos.push(4);
                                }
                            }
                        } catch (e) { console.error("Error contando partidos", e); }

                        // Procesar desbloqueos
                        for (const idLogro of logrosCumplidos) {
                            try {
                                const res = await apiService.post('/logros/desbloquear', { id_logro: idLogro });

                                if (res.data.body.nuevo) {

                                    setAchievementName(res.data.body.logro.nombre);
                                    setShowAchievementToast(true);

                                    setTimeout(() => setShowAchievementToast(false), 4000);

                                    // Actualizar usuario (monedas)
                                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                                    if (currentUser) {
                                        const usuarioActualizado = res.data.body.usuario || currentUser.usuario;

                                        localStorage.setItem('user', JSON.stringify({ ...currentUser, usuario: usuarioActualizado }));
                                        window.dispatchEvent(new Event("storage")); // Actualizar Navbar
                                    }
                                }
                            } catch (e) { console.error("Error verificando logro", e); }
                        }
                    };

                    // Llamar a la función (sin await para no bloquear el modal)
                    checkLogros();

                } catch (error) {
                    console.error("Error guardando partido:", error);
                    setCoinsEarned(0);
                }
                setGameOverData({ winner, score: `${scoreLeft} - ${scoreRight}` });
            };
        });

        return () => {
            game.destroy(true);
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

    const handlePlayAgain = () => {
        setGameOverData(null);
        sceneInstance?.resetGame();
    };

    const handleExit = () => {
        navigate('/home'); // Ajusta la ruta a tu menú
    };

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

    return (
        <>
            {/* MODAL DE GAME OVER */}
            {gameOverData && (
                <GameOverModal
                    winner={gameOverData?.winner ?? ''}
                    score={gameOverData?.score ?? ''}
                    coins={coinsEarned}
                    onRestart={handlePlayAgain}
                    onExit={handleExit}
                />
            )}
            <AnimatePresence>
                {showAchievementToast && (
                    <motion.div
                        initial={{ y: -100, opacity: 0, scale: 0.5 }}
                        animate={{ y: 100, opacity: 1, scale: 1 }} // Bajamos un poco más para que se note
                        exit={{ y: -100, opacity: 0, scale: 0.5 }}
                        className="fixed top-0 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-2xl border-4 border-yellow-400 shadow-[0_0_20px_rgba(255,165,0,0.6)]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">🏆</span>
                            <div className="flex flex-col">
                                <span className="text-sm text-yellow-200 uppercase tracking-widest">¡Logro Desbloqueado!</span>
                                <span className="text-2xl text-white drop-shadow-md">{achievementName}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
    // El componente ya no renderiza el canvas, Phaser lo hará por él.
    //return null;
});

export default GameCanvas;