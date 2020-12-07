

export class UserWebHelper {
static getPreguntasSecretasOptList(): PreguntaSecreta[] {
    return preguntasSecretas;
  }

}

const preguntasSecretas: PreguntaSecreta[] = [{
    key: 'mascota',
    label: '¿Nombre de tu mascota?',
  }, {
    key: 'madre',
    label: '¿Primer nombre de tu madre?',
  }, {
    key: 'hijo',
    label: '¿Primer nombre de tu hijo?',
  }, {
    key: 'color',
    label: '¿Color favorito?',
  }, {
    key: 'comida',
    label: '¿Comida favorita?',
}];

export class PreguntaSecreta {
    key: string;
    label: string;
  }