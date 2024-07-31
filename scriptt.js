// Funções e variáveis comuns a todos os jogos
function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
}

function onDragEnd(event) {
    event.target.classList.remove('dragging');
    removePlaceholder();
}

function onDragOver(event) {
    event.preventDefault();

    const dropzone = event.target.closest('.columnx');
    if (!dropzone || !document.querySelector('.dragging')) return;

    const draggingItem = document.querySelector('.dragging');
    const items = Array.from(dropzone.querySelectorAll('.item'));
    const rect = dropzone.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;

    let insertBefore = null;

    for (let item of items) {
        const itemRect = item.getBoundingClientRect();
        const itemMiddle = itemRect.top + itemRect.height / 2;

        if (offsetY < itemMiddle) {
            insertBefore = item;
            break;
        }
    }

    if (insertBefore) {
        dropzone.insertBefore(createPlaceholder(), insertBefore);
    } else {
        dropzone.appendChild(createPlaceholder());
    }
}

function onDrop(event) {
    event.preventDefault();

    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target.closest('.columnx');

    if (!dropzone || !draggableElement) return;

    const placeholder = document.querySelector('.placeholder');
    dropzone.insertBefore(draggableElement, placeholder);
    removePlaceholder();
}

function createPlaceholder() {
    let placeholder = document.querySelector('.placeholder');
    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        placeholder.style.height = '0.2px';  // Reduz o tamanho do placeholder para melhorar a responsividade
    }
    return placeholder;
}

function removePlaceholder() {
    const placeholder = document.querySelector('.placeholder');
    if (placeholder) {
        placeholder.remove();
    }
}

// Função para embaralhar os elementos do array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Jogo 1 - Algoritmo Triângulo
function checkSequenceTriangulo() {
    const correctSequence = [
        "lado1 = float(input('Digite o comprimento do primeiro lado: '))",
        "lado2 = float(input('Digite o comprimento do segundo lado: '))",
        "lado3 = float(input('Digite o comprimento do terceiro lado: '))",
        "if lado1 == lado2 == lado3:",
        "print('Triângulo equilátero')",
        "elif lado1 != lado2 != lado3 != lado1:",
        "print('Triângulo escaleno')",
        "else:",
        "print('Triângulo isósceles')"
    ];
    checkSequence(correctSequence, 'drop-column');
}

// Jogo 2 - Algoritmo Fatorial
function checkSequenceFatorial() {
    const correctSequence = [
        "num = int(input('Digite um número: '))",
        "fatorial = 1",
        "if num >= 0:",
        "for i in range(1, num + 1):",
        "fatorial *= i",
        "print('O fatorial de', num, 'é', fatorial)",
        "else:",
        "print('Entrada inválida!')"
    ];
    checkSequence(correctSequence, 'drop-column2');
}

// Função genérica para checar a sequência e lançar confete
function checkSequence(correctSequence, dropColumnId) {
    const dropColumn = document.getElementById(dropColumnId);
    const items = dropColumn.querySelectorAll('.item');
    let sequenceCorrect = true;

    items.forEach((item, index) => {
        if (item.textContent.trim() !== correctSequence[index]) {
            item.style.color = 'red';
            sequenceCorrect = false;
        } else {
            item.style.color = 'green';
        }
    });

    if (sequenceCorrect && items.length === correctSequence.length) {
        let params = {
            particleCount: 150,
            spread: 90,
            startVelocity: 70,
            origin: { x: 0, y: 0.5 },
            angle: 45
        };
        confetti(params);
        params.origin.x = 1;
        params.angle = 135;
        confetti(params);
    }
}

// Embaralha e insere os textos nos itens
document.addEventListener('DOMContentLoaded', function() {
    const jogos = {
        game1: [
            "lado1 = float(input('Digite o comprimento do primeiro lado: '))",
            "lado2 = float(input('Digite o comprimento do segundo lado: '))",
            "lado3 = float(input('Digite o comprimento do terceiro lado: '))",
            "if lado1 == lado2 == lado3:",
            "print('Triângulo equilátero')",
            "elif lado1 != lado2 != lado3 != lado1:",
            "print('Triângulo escaleno')",
            "else:",
            "print('Triângulo isósceles')"
        ],
        game2: [
            "num = int(input('Digite um número: '))",
            "fatorial = 1",
            "if num >= 0:",
            "for i in range(1, num + 1):",
            "fatorial *= i",
            "print('O fatorial de', num, 'é', fatorial)",
            "else:",
            "print('Entrada inválida!')"
        ]
    };

    const game1Items = document.querySelectorAll('#game1-items .item');
    const game2Items = document.querySelectorAll('#game2-items .item');

    if (game1Items.length > 0) {
        shuffle(jogos.game1).forEach((text, index) => {
            game1Items[index].textContent = text;
        });

        document.querySelectorAll('#game1-items .item').forEach(item => {
            item.addEventListener('dragstart', onDragStart);
            item.addEventListener('dragend', onDragEnd);
        });

        const dropColumn1 = document.getElementById('drop-column');
        if (dropColumn1) {
            dropColumn1.addEventListener('dragover', onDragOver);
            dropColumn1.addEventListener('drop', onDrop);
        }
    }

    if (game2Items.length > 0) {
        shuffle(jogos.game2).forEach((text, index) => {
            game2Items[index].textContent = text;
        });

        document.querySelectorAll('#game2-items .item').forEach(item => {
            item.addEventListener('dragstart', onDragStart);
            item.addEventListener('dragend', onDragEnd);
        });

        const dropColumn2 = document.getElementById('drop-column2');
        if (dropColumn2) {
            dropColumn2.addEventListener('dragover', onDragOver);
            dropColumn2.addEventListener('drop', onDrop);
        }
    }
});
