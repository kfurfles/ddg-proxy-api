const DATA = [
	'Mariposa',
	'Prisma',
	'Orvalho',
	'Neblina',
	'Silêncio',
	'Labirinto',
	'Miragem',
	'Eclipse',
	'Catedral',
	'Oásis',
	'Horizonte',
	'Enigma',
	'Fulgor',
	'Nostalgia',
	'Bruma',
	'Épico',
	'Fantasia',
	'Solstício',
	'Utopia',
	'Renovação',
	'Vórtice',
	'Saga',
	'Constelação',
	'Metamorfose',
	'Aurora',
	'Paradoxo',
	'Fábula',
	'Galáxia',
	'Reflexo',
	'Infinito',
	'Abacaxi',
	'Aventura',
	'Balão',
	'Carro',
	'Dama',
	'Elefante',
	'Foguete',
	'Gato',
	'Horizonte',
	'Ilha',
	'Jogo',
	'Kiwi',
	'Lápis',
	'Mágica',
	'Navio',
	'Ovelha',
	'Pássaro',
	'Quadro',
	'Rato',
	'Sapo',
	'Tartaruga',
	'Urso',
	'Vaca',
	'Xaxim',
	'Zebra',
	'Árvore',
	'Bolha',
	'Casa',
	'Dente',
	'Escola',
	'Fada',
	'Gelo',
	'História',
	'Imagem',
	'Janela',
	'Ketchup',
	'Livro',
	'Morte',
	'Noite',
	'Ovo',
	'Pente',
	'Quente',
	'Rua',
	'Sol',
	'Tinta',
	'Uva',
	'Vento',
	'Xadrez',
	'Yoga',
	'Zangão',
	'Açúcar',
	'Baleia',
	'Caneta',
	'Doce',
	'Escova',
	'Feijão',
	'Garrafa',
	'Helicóptero',
	'Inseto',
	'Jujuba',
];

function shuffle(array) {
	const shuffledArray = array.slice();

	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));

		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}

	return shuffledArray;
}

function randomWord(context, events, done) {
	context.vars.word = shuffle(DATA)[0];
	return done();
}

module.exports = {
	randomWord: randomWord,
};
