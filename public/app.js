const toCurrency = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})


const $card = document.querySelector('#card')
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            // console.log(id)
            fetch('/card/remove/' + id, { 
                method: 'delete'
            }).then(res => res.json()).then(card => {
                console.log(card.courses.length)
                if(card.courses.length) {
                    const html = card.courses.map(cd => {
                        // console.log(cd)
                        // debugger
                        return `
                    <tr>
                        <td>${cd.title}</td>
                        <td>${cd.count}</td>
                        <td>
                            <button class="btn btn-small js-remove" data-id="${cd.id}">Удалить</button>
                        </td>
                    </tr>
                    `
                    }).join('')

                    // console.log(html)
                    $card.querySelector('tbody').innerHTML = html
                    $card.querySelector('.price').textContent = toCurrency(card.price)
                } else {
                    $card.innerHTML = '<p>Корзина пуста</p>'
                }
            })
        }
    })
}