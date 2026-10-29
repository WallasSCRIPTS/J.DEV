function Portal() {
    const nome = 'Jonas'

    return (
        <div>
            <h1>My first Portal!</h1>
            <p>Olá, {nome}!</p>
            <p>{nome == 'Jonas' ? 'Você é o Jonas!' : 'Você não é o Jonas.'}</p>
        </div>
    )
}