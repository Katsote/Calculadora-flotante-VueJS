Vue.component('calculadora', {
	template: `
	<div class="calculadora"	
	@keyup.48="addnumber(0)" @keyup.49="addnumber(1)" @keyup.50="addnumber(2)"
	@keyup.51="addnumber(3)" @keyup.52="addnumber(4)"
	@keyup.53="addnumber(5)" @keyup.54="addnumber(6)" @keyup.55="addnumber(7)" @keyup.56="addnumber(8)"
	@keyup.57="addnumber(9)"

	@keyup.96="addnumber(0)" @keyup.97="addnumber(1)" @keyup.98="addnumber(2)"
	@keyup.99="addnumber(3)" @keyup.100="addnumber(4)"
	@keyup.101="addnumber(5)" @keyup.102="addnumber(6)" @keyup.103="addnumber(7)" 
	@keyup.104="addnumber(8)" @keyup.105="addnumber(9)"

	@keyup.42="addsign('*')" @keyup.43="addsign('+')" @keyup.45="addsign('-')"
	@keyup.47="addsign('/')"

	@keyup.106="addsign('*')" @keyup.107="addsign('+')" @keyup.109="addsign('-')"
	@keyup.111="addsign('/')"

	@keyup.08="addsign('del')" @keyup.46="addsign('C')"
	>
		<transition name="calc-fade">
			<div class="calc" v-if="mostrar.estado" :style="[mostrar.size.height+'px', mostrar.size.width+'px']">
				
				<div class="calc__header">
					<input type="text" class="calc__input" v-model="getvalorinput" :style="{'padding-right': spanWidth + 'px'}" disabled>
					<span class="calc__total">{{gettotal}}</span>
				</div>
				<div class="calc__body">
					<button class="calc__btn--number calc__btn" :class="{'calc__btn--zero':!btn}" v-for="btn in numbers" @click="addnumber(btn)">{{btn}}</button>
				</div>

				<div class="calc__aside">
					<button class="calc__btn--sign calc__btn" v-for="sign in signos" @click="addsign(sign)" v-if="sign == 'del'"><i class="calc__btn--sign-delete fas fa-backspace"></i></button>
					<button class="calc__btn--sign calc__btn" v-for="sign in signos" @click="addsign(sign)" v-if="sign !== 'del'">{{sign}}</button>
				</div>
			</div>
		</transition>

		<button class="calc__btn--open" @mousedown="movemouse" @mouseup="leavemovemouse"><i class="fas fa-calculator calc__btn--open-icon"></i></button>
	</div> 
	`,
	data () {
		return {
			numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
			signos: ['del', 'C', '+', '-', '/', '*'],
			mostrar: {
				estado: false,
				aux: false,
				posX: '0px',
				posY: '0px',
				size: {
					height: 280,
					width: 340
				},
			},
			valores: [],
			spanWidth: '0',
			moving: false,
			move: true //Variable que declara si se va a poder mover la burbuja o no. Por defecto en PC es Si y en Tlf es No
		}
	},
	mounted(){
		// Revisamos si es un movil o una pc
		let Os = (navigator.platform.match(/Window/i)) || (navigator.platform.match(/Linux/i)) || (navigator.platform.match(/Mac/i));

		if(Os == 'null'){
			this.move = false;
		} else{
			alert(navigator.platform)
			alert(Os)
		}
		
		// Buscamos la posicion guardada
		if(this.move == true){
			if(localStorage.getItem('calcPos') != null){
				// Obtenemos valores guardados
				this.posX = JSON.parse(localStorage.getItem('calcPos')).X;
				this.posY = JSON.parse(localStorage.getItem('calcPos')).Y;

				if(this.posX != '0px' && this.posY != '0px'){
					// arreglamos todo
					let calc = document.getElementsByClassName('calculadora');
				    let width = calc[0].offsetWidth;
				    let height = calc[0].offsetHeight;
					
					// Movemos a la posicion anterior
					calc[0].style.left = this.posX;
					calc[0].style.top = this.posY;
					calc[0].style.right = 'unset';
				    calc[0].style.bottom = 'unset';

				    alert('posicionando');
				}
			}
		}
	},
	updated(){
		if(this.move == true){
			let porcentajeX = 0;
			let porcentajeY = 0;

		    let calc = document.getElementsByClassName('calculadora');
		    let calc_in = document.getElementsByClassName('calc');
		    let calc_btn = document.getElementsByClassName('calc__btn--open');

		    if(calc_in.length > 0){
				// 100 - el porcentaje que representa el tamaño del botón inferior para el tamaño total de la calculadora abierta de esa manera sabremos cuanto moverla 
			    porcentajeX = (100 - (calc_btn[0].offsetWidth * 100) / this.mostrar.size.width).toFixed(2);
			    porcentajeY = ((100 + (calc_btn[0].offsetHeight * 100) / this.mostrar.size.height) + 10).toFixed(2);
		    }

			this.fixCalcScreen(porcentajeX, porcentajeY, calc_in, calc_btn, calc);
		}
	},
	computed: {
		getvalorinput(){
			let valor_input = '';

			for (valor of this.valores) {
				valor_input += valor + '';
			}

			return valor_input;
		},
		gettotal(){

				let valor_aux = [];
				let contador = 0;
				let total = 0;

				// Convertimos en un array que nos servirá de auxiliar
				for (valor of this.valores){

					if(typeof valor == 'number'){

						// Si ya hay un número dentro es porque viene otro número más
						if(typeof valor_aux[contador] == "number"){
							valor_aux[contador] = (valor_aux[contador] * 10) + valor;
						} else{ //Sino, solo añadimos los números normalmente
							valor_aux[contador] = parseInt(valor, 10);
						}

					} else {
						valor_aux.push(valor);
						contador = valor_aux.length;
					}
				}

				// Comenzamos
				let index_actual = 0;
				let num1 = 0;
				let num2 = 0;

				// Empezamos a resolver por orden jerarquico
				this.resolverOperaciones('*', valor_aux, index_actual);
				this.resolverOperaciones('/', valor_aux, index_actual);
				this.resolverOperaciones('+', valor_aux, index_actual);
				this.resolverOperaciones('-', valor_aux, index_actual);

				// Acomodamos el padding
				let width = document.getElementsByClassName('calc__total')[0];

				if(typeof width == 'undefined'){
					this.spanWidth = 0;
				} else{
					this.spanWidth = width.offsetWidth + 26;
				}

				// Devolvemos
				return valor_aux[0];
		}
	},
	methods: {
		addnumber(number){
			this.valores.push(number);
			this.checksign();
		},
		addsign(sign){
			if(sign != 'del' && sign != 'C'){
				if(this.checksign()){
					this.valores.push(sign);
				} else{
					this.valores.splice((this.valores.length - 1), 1);
					this.valores.push(sign);
				}
			} else{
				if(sign == 'del'){
					this.valores.splice((this.valores.length - 1), 1);
				} else{
					this.valores.splice(0, this.valores.length);
				}
			}
		},
		checksign(){
			if(typeof this.valores[this.valores.length - 1] == 'number'){
				return true;
			} else{
				return false;
			}
		},
		movemouse(){
			if(this.move == true){
				// Guardamos el estado antes de moverlo
				this.mostrar.aux = this.mostrar.estado;

				// Activamos el movimiento
				this.moving = true;

				// Guardamos la antigua posicion
			    let calc = document.getElementsByClassName('calculadora');
			    this.mostrar.posX = calc[0].style.left;
			    this.mostrar.posY = calc[0].style.top;

			    let calc_in = document.getElementsByClassName('calc');
			    let calc_btn = document.getElementsByClassName('calc__btn--open');

				if(this.moving){
				    // *Preparamos todo para acomodar la calculadora cuando no quepa* //
					let porcentajeX = 0;
					let porcentajeY = 0;

				    if(calc_in.length > 0){
	    				// 100 - el porcentaje que representa el tamaño del botón inferior para el tamaño total de la calculadora abierta de esa manera sabremos cuanto moverla 
	    			    porcentajeX = (100 - (calc_btn[0].offsetWidth * 100) / calc_in[0].offsetWidth).toFixed(2);
	    			    porcentajeY = ((100 + (calc_btn[0].offsetHeight * 100) / calc_in[0].offsetHeight) + 10).toFixed(2);
				    }

				    calcTransform = {X: 'translateX(0%)', Y: 'translateY(0%)'};
				    
				    moveX = 0; 
				    moveY = 0;

					window.onmousemove = function (){
					    calc[0].style.right = 'unset';
					    calc[0].style.bottom = 'unset';

					    let x = window.event.clientX;
					    let y = window.event.clientY;
					    let width = calc[0].offsetWidth;
					    let height = calc[0].offsetHeight;

					    calc[0].style.top = (y - (height * 50 / 100)) + 'px';
					    calc[0].style.left = (x - (width * 50 / 100)) + 'px';

						if(calc_in.length > 0){
						    if((parseInt(calc[0].style.left.substring(0, calc[0].style.left.length - 2)) < calc_in[0].offsetWidth) && !moveX){
						    	
						    	calcTransform.X = 'translateX('+porcentajeX+'%)';

						    	moveX = 1;
						    } else if(
						    	!(parseInt(calc[0].style.left.substring(0, calc[0].style.left.length - 2)) < calc_in[0].offsetWidth) && //Para que no se repita
						    	(calc_in[0].style.transform == calcTransform.X + " " + calcTransform.Y) && //Para confirmar que la condicion anterior se cumplió
						    	moveX){ //Para que no se repita de nuevo la primera condición
						    	
						    	calcTransform.X = 'translateX(0%)';

						    	moveX = 0;
						    }

						    if((parseInt(calc[0].style.top.substring(0, calc[0].style.top.length - 2)) < calc_in[0].offsetHeight) && !moveY){
						    	
						    	calcTransform.Y = 'translateY('+porcentajeY+'%)';

						    	moveY = 1;
						    } else if(
						    	!(parseInt(calc[0].style.top.substring(0, calc[0].style.top.length - 2)) < calc_in[0].offsetHeight) &&
						    	(calc_in[0].style.transform == calcTransform.X + " " + calcTransform.Y) &&
						    	moveY){

						    	calcTransform.Y = 'translateY(0%)';

						    	moveY = 0;
						    }

						    calc_in[0].style.transform = calcTransform.X + " " + calcTransform.Y;
						}
					}
				}
			}
		},
		leavemovemouse(){
			if(this.move == true){

				alert(this.move);

			    // Desactivamos el movimiento
				this.moving = false;
				window.onmousemove = null;

			    let calc = document.getElementsByClassName('calculadora');

				// Verificamos si cambió de posición
				if(this.mostrar.posX != calc[0].style.left &&
					this.mostrar.posY != calc[0].style.top){
					this.mostrar.estado = this.mostrar.aux;
				} else {
					this.mostrar.estado = !this.mostrar.estado;	
				}

				// Guardamos la nueva posicion
			    this.mostrar.posX = calc[0].style.left;
			    this.mostrar.posY = calc[0].style.top;
				localStorage.setItem('calcPos', JSON.stringify({X: this.mostrar.posX, Y: this.mostrar.posY}));

				alert('guardado');
			} else{
				this.mostrar.estado = !this.mostrar.estado;	
			}
		},
		fixCalcScreen(porcentajeX, porcentajeY, calc_in, calc_btn, calc, calcTransform = {X: 'translateX(0%)', Y: 'translateY(0%)'}, moveX = 0, moveY = 0){//Acomoda la calculadora cuando no cabe en la pantalla

			/*Esto se debe hacer para obtener el porcentaje que se va a pasar*/
		  //   if(calc_in.length > 0){
				// 100 - el porcentaje que representa el tamaño del botón inferior para el tamaño total de la calculadora abierta de esa manera sabremos cuanto moverla 
			 //    porcentajeX = (100 - (calc_btn[0].offsetWidth * 100) / calc_in[0].offsetWidth).toFixed(2);
			 //    porcentajeY = ((100 + (calc_btn[0].offsetHeight * 100) / calc_in[0].offsetHeight) + 10).toFixed(2);
		  //   }

			if(calc_in.length > 0){
			    if((parseInt(calc[0].style.left.substring(0, calc[0].style.left.length - 2)) < this.mostrar.size.width) && !moveX){
			    	
			    	calcTransform.X = 'translateX('+porcentajeX+'%)';


			    	moveX = 1;
			    } else if(
			    	!(parseInt(calc[0].style.left.substring(0, calc[0].style.left.length - 2)) < this.mostrar.size.width) && //Para que no se repita
			    	(calc_in[0].style.transform == calcTransform.X + " " + calcTransform.Y) && //Para confirmar que la condicion anterior se cumplió
			    	moveX){ //Para que no se repita de nuevo la primera condición
			    	
			    	calcTransform.X = 'translateX(0%)';

			    	moveX = 0;
			    }

			    if((parseInt(calc[0].style.top.substring(0, calc[0].style.top.length - 2)) < this.mostrar.size.height) && !moveY){
			    	
			    	calcTransform.Y = 'translateY('+porcentajeY+'%)';

			    	moveY = 1;
			    } else if(
			    	!(parseInt(calc[0].style.top.substring(0, calc[0].style.top.length - 2)) < this.mostrar.size.height) &&
			    	(calc_in[0].style.transform == calcTransform.X + " " + calcTransform.Y) &&
			    	moveY){

			    	calcTransform.Y = 'translateY(0%)';

			    	moveY = 0;
			    }

			    calc_in[0].style.transform = calcTransform.X + " " + calcTransform.Y;
			}
		},
		resolverOperaciones(operacion, valor_aux, index_actual){

			for(i = 0; i < valor_aux.length && index_actual != '-1'; i++){
				index_actual = valor_aux.findIndex(element => element == operacion);

				if(index_actual != '-1'){
					num1 = valor_aux[index_actual - 1];
					num2 = valor_aux[index_actual + 1];
					
					if(typeof num2 !== 'undefined'){
						valor_aux.splice(index_actual - 1, 2);

						switch (operacion) {
							case '*':
								valor_aux[index_actual - 1] = num1 * num2;
								break;
							case '/':
								valor_aux[index_actual - 1] = num1 / num2;
								break;
							case '-':
								valor_aux[index_actual - 1] = num1 - num2;
								break;
							case '+':
								valor_aux[index_actual - 1] = num1 + num2;
								break;
						}
					}

				}
			}
		}
	}


})
