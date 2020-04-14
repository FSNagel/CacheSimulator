const cache = function () {

	let tamanho_celula = 8;

	let array_MP = [];
	let numero_celulas_MP = 128;
	let qtd_celulas_bloco_MP = 4;
	let numero_blocos_MP = 0;

	let endereco_MP = 0;
	let bloco_endereco_MP = 0;

	let array_CH = [];
	let numero_linhas_CH = 8;
	let linhas_conjuntos_CH = 4;
	let linha_montada_CH = [];

	let dados_hits = {
		'leitura': {
			'acertos': 0,
			'erros': 0,
			'p_acertos': 0,
			'p_erros': 0,
		},

		'escrita': {
			'acertos': 0,
			'erros': 0,
			'p_acertos': 0,
			'p_erros': 0,
		},

		'geral': {
			'acertos': 0,
			'erros': 0,
			'p_acertos': 0,
			'p_erros': 0,
		},
	};

	const dec_to_bho = function (n, base) {

		if (n < 0) {
			n = 0xFFFFFFFF + n + 1;
		}

		switch (base) {

			case 'B':
				return parseInt(n, 10).toString(2);
				break;

			case 'H':
				return parseInt(n, 10).toString(16);
				break;

			case 'O':
				return parseInt(n, 10).toString(8);
				break;

			default:
				return ("Valor inválido");
		}
	}



	//Número de bits
	const montaCache = function () {
		let deslocamento = 0;
		let conjunto = 0;
		let rotulo = 0;
		let politica = 0;
		let zero = '0';

		deslocamento = Math.log2(qtd_celulas_bloco_MP);
		conjunto = Math.log2(numero_linhas_CH / linhas_conjuntos_CH);
		rotulo = Math.log2((numero_celulas_MP / qtd_celulas_bloco_MP) / (numero_linhas_CH / linhas_conjuntos_CH));
		politica = 3;

		linha_montada_CH = {
			bit_validacao: 0,
			politica: 0,
			rotulo: 0,
			conjunto: 0,
			valores: new Array(qtd_celulas_bloco_MP).fill(0)
		};

	}

	const preencheCache = function () {
		for (let i = 0; i < numero_linhas_CH; i++) {
			array_CH[i] = { ...linha_montada_CH };
		}
	}


	const imprimeCache = function () {
		let cache = '<h2>Memória Cache</h2>'

		cache += '<table class="table">';
		cache += '<thead>';
		cache += '<td>Valid</td>';
		cache += '<td>Política</td>';
		cache += '<td>Rótulo</td>';
		cache += '<td>Conjunto</td>';
		cache += '<td>V.D. 00</td>';
		cache += '<td>V.D. 01</td>';
		cache += '<td>V.D. 10</td>';
		cache += '<td>V.D. 11</td>';
		cache += '</thead>';
		cache += '<tbody>';

		for (let i = 0; i < array_CH.length; i++) {
			cache += '<tr ' + (i < 4 ? 'class="bg-primary text-white"' : 'class="bg-success text-white"') + '>';
			cache += '<td>' + array_CH[i]['bit_validacao'] + '</td>';
			cache += '<td>' + (dec_to_bho(array_CH[i]['politica'], 'B')).padStart(3, '0') + '</td>';
			cache += '<td>' + String(array_CH[i]['rotulo']).padStart(4, '0') + '</td>';
			cache += '<td>' + array_CH[i]['conjunto'] + '</td>';
			cache += '<td>' + (dec_to_bho(array_CH[i]['valores'][0], 'B')).padStart(8, '0') + '</td>';
			cache += '<td>' + (dec_to_bho(array_CH[i]['valores'][1], 'B')).padStart(8, '0') + '</td>';
			cache += '<td>' + (dec_to_bho(array_CH[i]['valores'][2], 'B')).padStart(8, '0') + '</td>';
			cache += '<td>' + (dec_to_bho(array_CH[i]['valores'][3], 'B')).padStart(8, '0') + '</td>';
			cache += '</tr>';
		}

		cache += ('</tbody></table>')

		$('#cache').html(cache);
	}

	const preencheMP = function () {
		array_MP = [];

		let qtd_linhas_ram = numero_celulas_MP / qtd_celulas_bloco_MP;
		let bloco = [];

		for (let i = 0; i < qtd_linhas_ram; i++) {
			bloco = [];

			//Valor fictício, inventar menor que 512
			bloco.push(i + 4);
			bloco.push(i + 9);
			bloco.push(i + 2);
			bloco.push(i + 1);

			array_MP[i] = bloco;
		}
	}

	const imprimeMP = function () {
		let mp = '<h2>Memória Principal</h2>';

		mp += '<table class="table" id="mp">';
		mp += '<thead>';
		mp += '<td>Endereço</td>';
		mp += '<td class="text-center">C0</td>';
		mp += '<td class="text-center">C1</td>';
		mp += '<td class="text-center">C2</td>';
		mp += '<td class="text-center">C3</td>';
		mp += '</thead>';
		mp += '<tbody>';

		let qtd_linhas_ram = numero_celulas_MP / qtd_celulas_bloco_MP;

		for (let i = 0; i < qtd_linhas_ram; i++) {
			mp += '<tr>';
			mp += '<td class="endereco bg-primary" endereco="' + (dec_to_bho(i * 4, 'B')).padStart(7, '0') + '">' + (dec_to_bho(i * 4, 'B')).padStart(7, '0') + '</td>';
			mp += '<td>' + (dec_to_bho(array_MP[i][0], 'B')).padStart(8, '0') + '</td>';
			mp += '<td>' + (dec_to_bho(array_MP[i][1], 'B')).padStart(8, '0') + '</td>';
			mp += '<td>' + (dec_to_bho(array_MP[i][2], 'B')).padStart(8, '0') + '</td>';
			mp += '<td>' + (dec_to_bho(array_MP[i][3], 'B')).padStart(8, '0') + '</td>';
			mp += '</tr>';
		}

		mp += '</tbody></table>';

		$('#mp').html(mp);
	}

	const imprimeHits = function () {
		let hits = '<table class="table">';
		hits += '<thead><tr>';
		hits += '<td>Definição</td>';
		hits += '<td>Leitura</td>';
		hits += '<td>Escrita</td>';
		hits += '<td>Geral</td>';
		hits += '</tr></thead>';
		hits += '<tbody>';
		hits += '<tr class="text-success">';
		hits += '<td><strong>Acertos</strong></td>';
		hits += '<td><strong>' + dados_hits['leitura']['acertos'] + '/' + dados_hits['leitura']['p_acertos'] + '% </strong></td>';
		hits += '<td><strong>' + dados_hits['escrita']['acertos'] + '/' + dados_hits['escrita']['p_acertos'] + '% </strong></td>';
		hits += '<td><strong>' + dados_hits['geral']['acertos'] + '/' + dados_hits['geral']['p_acertos'] + '% </strong></td>';
		hits += '</tr>';
		hits += '<tr class="text-danger">';
		hits += '<td><strong>Erros</strong></td>';
		hits += '<td><strong>' + dados_hits['leitura']['erros'] + '/' + dados_hits['leitura']['p_erros'] + '% </strong></td>';
		hits += '<td><strong>' + dados_hits['escrita']['erros'] + '/' + dados_hits['escrita']['p_erros'] + '% </strong></td>';
		hits += '<td><strong>' + dados_hits['geral']['erros'] + '/' + dados_hits['geral']['p_erros'] + '% </strong></td>';
		hits += '</tr>';
		hits += '';
		hits += '</tbody>';
		hits += '</table>';

		$('#hits').html(hits);
	}

	const atualizaImpressoes = function () {
		imprimeCache();
		imprimeMP();
		imprimeHits();
	}

	const contaHit = function (modo, acerto) {

		let acertos = 0;
		let erros = 0;
		let p_acertos = 0;
		let p_erros = 0;

		if (modo == 'leitura') {

			if (acerto) {
				dados_hits['leitura']['acertos']++;
			} else {
				dados_hits['leitura']['erros']++;
			}

			acertos = dados_hits['leitura']['acertos'];
			erros = dados_hits['leitura']['erros'];
			let total = acertos + erros;

			if (erros > acertos) {
				p_acertos = ((acertos / total) * 100).toFixed(2);
				p_erros = (100 - p_acertos).toFixed(2);
			} else {
				p_erros = ((erros / total) * 100).toFixed(2);
				p_acertos = (100 - p_erros).toFixed(2);
			}

			dados_hits['leitura']['p_acertos'] = p_acertos;
			dados_hits['leitura']['p_erros'] = p_erros;
		} else {

			if (acerto) {
				dados_hits['escrita']['acertos']++;
			} else {
				dados_hits['escrita']['erros']++;
			}

			acertos = dados_hits['escrita']['acertos'];
			erros = dados_hits['escrita']['erros'];
			let total = acertos + erros;
			if (erros > acertos) {
				p_acertos = ((acertos / total) * 100).toFixed(2);
				p_erros = (100 - p_acertos).toFixed(2);
			} else {
				p_erros = ((erros / total) * 100).toFixed(2);
				p_acertos = (100 - p_erros).toFixed(2);
			}

			dados_hits['escrita']['p_acertos'] = p_acertos;
			dados_hits['escrita']['p_erros'] = p_erros;
		}

		if (acerto) {
			dados_hits['geral']['acertos']++;
		} else {
			dados_hits['geral']['erros']++;
		}

		acertos = dados_hits['geral']['acertos'];
		erros = dados_hits['geral']['erros'];
		let total = acertos + erros;
		if (erros > acertos) {
			p_acertos = ((acertos / total) * 100).toFixed(2);
			p_erros = 100 - p_acertos;
		} else {
			p_erros = ((erros / total) * 100).toFixed(2);
			p_acertos = 100 - p_erros;
		}

		dados_hits['geral']['p_acertos'] = p_acertos;
		dados_hits['geral']['p_erros'] = p_erros;

		imprimeHits();
	}

	const lerEndereco = function (endereco, operacao) {

		if (endereco.length != 7) {
			alert("Você deve informar um endereço com 7 digitos");
			return false;
		}

		let deslocamento = endereco.substr(5, 2);
		deslocamento = parseInt(deslocamento, 2);
		let conjunto = endereco.substr(4, 1);
		let rotulo = endereco.substr(0, 4);
		let bloco = endereco.substr(0, 5);

		conjunto = conjunto % (numero_linhas_CH / linhas_conjuntos_CH);

		let metade = array_CH.length / 2;

		if (conjunto == 0) {

			for (let i = 0; i < metade; i++) {
				if (array_CH[i]['rotulo'] == rotulo) {
					if (array_CH[i]['bit_validacao']) {
						contaHit(operacao, true);
						printInfo(true, bloco, array_CH[i].valores[deslocamento], conjunto, deslocamento);
						return false;
					}
				}
			}

			for (let i = 0; i < metade; i++) {
				array_CH.politica = parseInt(array_CH[i].politica);
				array_CH[i].politica++;
			}

		} else {

			for (let i = metade; i < array_CH.length; i++) {
				if (array_CH[i]['rotulo'] == rotulo) {
					if (array_CH[i]['bit_validacao']) {
						contaHit(operacao, true);
						printInfo(true, bloco, array_CH[i].valores[deslocamento], conjunto, deslocamento);
						return false;
					}
				}
			}

			for (let i = metade; i < array_CH.length; i++) {
				array_CH.politica = parseInt(array_CH[i].politica);
				array_CH[i].politica++;
			}

		}


		contaHit(operacao, false);
		carregaMPParaCH(endereco);

		atualizaImpressoes();
	}

	const carregaMPParaCH = async function (endereco) {
		let deslocamento = endereco.substr(5, 2);
		deslocamento = parseInt(deslocamento, 2);
		let conjunto = endereco.substr(4, 1);
		let rotulo = endereco.substr(0, 4);
		let bloco = endereco.substr(0, 5);
		bloco = parseInt(bloco, 2);
		let bloco_retorno = 0;

		let valores = array_MP[bloco];

		conjunto = conjunto % (numero_linhas_CH / linhas_conjuntos_CH);

		let politica = -1;
		let politica_int = 0;
		let metade = array_CH.length / 2;
		let indice_sai = 0;
		let bit_validacao = 1;

		if (conjunto == 0) {

			for (let i = 0; i < metade; i++) {
				if (array_CH[i]['bit_validacao'] == 0) {
					indice_sai = i;
					bit_validacao = 0;
				}

				if (array_CH[i]['politica'] > politica && bit_validacao == 1) {
					indice_sai = i;
					politica = array_CH[i]['politica'];

					bloco_retorno = parseInt((array_CH[i]['rotulo'] + array_CH[i]['conjunto']), 2);
					array_MP[bloco_retorno] = array_CH[i]['valores'];
				}
			}
		} else {

			for (let i = metade; i < array_CH.length; i++) {
				if (array_CH[i]['bit_validacao'] == 0) {
					indice_sai = i;
					bit_validacao = 0;
				}

				if (array_CH[i]['politica'] > politica && bit_validacao == 1) {
					indice_sai = i;
					politica = array_CH[i]['politica'];

					bloco_retorno = parseInt((array_CH[i]['rotulo'] + array_CH[i]['conjunto']), 2);
					array_MP[bloco_retorno] = array_CH[i]['valores'];
				}

			}
		}

		let atualiza = {
			politica: 0,
			bit_validacao: 1,
			rotulo: rotulo,
			conjunto: conjunto,
			valores: valores
		}

		array_CH[indice_sai] = atualiza;
		printInfo(false, dec_to_bho(bloco, 'B'), array_CH[indice_sai].valores[deslocamento], conjunto, deslocamento);


	}

	const escreverEndereco = function (endereco) {
		let deslocamento = endereco.substr(5, 2);
		deslocamento = parseInt(deslocamento, 2);

		let rotulo = endereco.substr(0, 4);
		let conjunto = endereco.substr(4, 1);
		conjunto = conjunto % (numero_linhas_CH / linhas_conjuntos_CH);

		let valor_escrita = $('#valor_escrita').val();
		if (valor_escrita.length != 8) {
			alert("Você deve informar um valor com 8 digitos");
			return false;
		}

		valor_escrita = parseInt(valor_escrita, 2);
		let valores = [];
		let indice_sai = 0;

		for (let i = 0; i < array_CH.length; i++) {
			if (array_CH[i]['conjunto'] == conjunto) {
				if (array_CH[i]['rotulo'] == rotulo) {
					if (array_CH[i]['bit_validacao']) {
						indice_sai = i;
					}
				}
			}
		}


		valores = array_CH[indice_sai]['valores'];
		valores[deslocamento] = valor_escrita;

		let atualiza = {
			politica: 0,
			bit_validacao: 1,
			rotulo: rotulo,
			conjunto: conjunto,
			valores: valores
		}

		array_CH[indice_sai] = atualiza;

		atualizaImpressoes();
	}

	const printInfo = function (encontrado_cache, bloco, valor, conjunto, deslocamento) {
		let info = '<div class="jumbotron mt-3"><h3 class="display-12">Informações</h3>';
		info += '<hr class="my-12">';
		info += '<div class="row"><div class="col-md-4">';
		info += '<p><strong>Encontrado na Cache:</strong> ' + (encontrado_cache ? 'Sim' : 'Não') + '</p>';
		info += '<p><strong>Bloco:</strong> ' + bloco + '</p>';
		info += '</div><div class="col-md-4">';
		info += '<p><strong>Conjunto: </strong>' + conjunto + '</p>';
		info += '<p><strong>Deslocamento: </strong>' + dec_to_bho(deslocamento, 'B') + '</p>';
		info += '</div>';
		info += '<div class="col-md-4">';
		info += '<p><strong>Valor no Campo: </strong>' + dec_to_bho(valor, 'B') + '</p>';
		info += '</div>';
		info += '</div>';

		$('#infos').html(info);
	}



	return {
		init: function () {

			montaCache();
			preencheCache();
			preencheMP();
			atualizaImpressoes();

			$(document).on('click', '#submit_ler_endereco', function (e) {
				e.preventDefault();
				lerEndereco($('#endereco').val(), 'leitura');
			});

			$(document).on('click', '#submit_escrever_endereco', function (e) {
				e.preventDefault();
				lerEndereco($('#endereco').val(), 'escrita');
				escreverEndereco($('#endereco').val());
			});
			
			$(document).on('click', '#mp td.endereco', function (e) {
				e.preventDefault();
				let obj = $(this);
				$('#endereco').val(obj.attr('endereco'));

			});
		}
	}

}();


window.onload = function () {
	cache.init();
}