/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface CharacterPreviewProps {
    skin: string; // "Santi", "Gio", etc.
}

class PreviewScene extends Phaser.Scene {
    private character!: any;
    
    constructor() {
        super({ key: 'PreviewScene' });
    }

    preload() {
        this.load.setPath('/assets/anim/');
        // Carga los mismos archivos que en el juego
        this.load.image('Players_Animations_Spine_tex.png', 'Players_Animations_Spine_tex.png');
        this.load.spine('player_anim', 'Players_Animations_Spine_ske.json', ['Players_Animations_Spine_tex.atlas'], false);
    }

    create() {
        // Creamos al personaje en el centro de la escena
        // Ajusta x, y y setScale según el tamaño de tu contenedor en el Home
        this.character = this.add.spine(200, 400, 'player_anim', 'Idle', true);
        this.character.setScale(0.65);
        
        this.character.setSkinByName('default');
        this.character.setSlotsToSetupPose();

        // Aplicar skin inicial
        this.applySkin(this.registry.get('skinData'));
        
        // Escuchar cambios desde React
        this.events.on('updateSkin', (newSkin: string) => {
            this.applySkin(newSkin);
        });
    }

    private applySkin(skinName: string) {
        if (!this.character) return;

        // Lógica manual de Skins
        const isSanti = skinName === "Santi";
        const prefix = isSanti ? "S_" : "G_";
        
        const skeleton = this.character.skeleton;
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
                const slot = skeleton.findSlot(map.slot);
                if (slot) {
                    const slotIndex = skeleton.findSlotIndex(map.slot);
                    const attachment = skeleton.getAttachment(slotIndex, attachmentName);
                    if (attachment) {
                        // PARCHE PARA GIO (Mano Izquierda volteada):
                        if (attachmentName === "G_Mano_Izquierda") {
                            attachment.scaleX = -1; 
                        }

                        slot.setAttachment(attachment);
                    } else {
                        console.warn(`Falta imagen: ${attachmentName}`);
                    }
                }
            } catch (e) { console.warn(e) }
        });
    }
}

const CharacterPreview = ({ skin }: CharacterPreviewProps) => {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (!window.SpinePlugin) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 400,  // Ancho del lienzo de preview
            height: 600, // Alto del lienzo
            parent: 'char-preview-container',
            transparent: true, // Importante para que se vea el fondo del estadio
            plugins: {
                scene: [{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }]
            },
            scene: [PreviewScene],
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;
        
        // Guardar dato inicial
        game.registry.set('skinData', skin);

        return () => {
            game.destroy(true);
        };
    }, [skin]);

    // Efecto para actualizar la skin cuando cambia la prop
    useEffect(() => {
        if (gameRef.current && gameRef.current.scene.getScene('PreviewScene')) {
            gameRef.current.scene.getScene('PreviewScene').events.emit('updateSkin', skin);
        }
    }, [skin]);

    return <div id="char-preview-container" style={{ width: '100%', height: '100%' }} />;
};

export default CharacterPreview;