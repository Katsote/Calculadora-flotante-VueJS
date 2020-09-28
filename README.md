# Calculadora-flotante-VueJS
It is a VueJS component easy to add to your code, which will allow you to have a floating calculator that you can move to any part of the screen where it is comfortable for you and will save the position when you change pages.

[Online example](https://github.com/Katsote/Calculadora-flotante-VueJS)

### How to use

You can see a example to use in the [Index html file](index.html) of the repository

```
//Font Awesome CDN example (You need to use your own FontAwesome CDN. This might not work)
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" crossorigin="anonymous">

//VueJs CDN
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js"></script>

//Calculator archives
<link rel="stylesheet" type="text/css" href="css/calc.css">
<script type="text/javascript" src="componentes/calc.js"></script>
```

### Personalize

[Sass archive](sass/calc.scss) has added to the repository. Now you can change easily the color of the entire component using the variables at the beginning of the code.

```
  // Colores
  $base_color:#FFC0CB;

  $input_color: #EEEEEE;
  $input_shadow_color: #D76D88;
  $input_text_color: #968484;

  $btn_color: #FCD9A6;
  $btn_active_color: #F9CE8F;
  $btn_border_color: #FFFFFF;
  $btn_text_color: #FFFFFF;
```


### Built with :hammer_and_wrench:

[VueJs](https://es.vuejs.org/v2/guide/installation.html#CDN) - Used web framework

[FontAwesome](https://fontawesome.com/start) - Calculator icon in open button

[Sass](https://sass-lang.com/) - Css preprocessor
