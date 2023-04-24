const Viskey = 'visitor', Bookkey='book', Cardkey='card'
let objId
let nodde
//window.localStorage.clear()
/*for(let i=1; i<13;i++)
{
    window.localStorage.removeItem(Cardkey+i)
}*/

class Book {
    id=0
    bookname
    author
    yearOfPublication
    publisher
    pages
    copies
    rate=0
    constructor(_name, _author, _year, _publisher, _pages, _copies)
    {
        this.bookname=_name
        this.author=_author
        this.yearOfPublication=_year
        this.publisher=_publisher
        this.pages=_pages
        this.copies=_copies
    }
    clone(book)
    {
        this.id=book.id
        this.bookname=book.bookname
        this.author=book.author
        this.yearOfPublication=book.yearOfPublication
        this.publisher=book.publisher
        this.pages=book.pages
        this.copies=book.copies
        this.rate=book.rate
    }
}
class Visitor {
    id=0
    fullName
    phone
    active=0
    constructor(_fullname, _phone)
    {
        this.fullName=_fullname
        this.phone=_phone
    }
    clone(vis)
    {
        this.id=vis.id
        this.fullName=vis.fullName
        this.phone=vis.phone
        this.active=vis.active
    }
}
class Card {
    id=0
    bookId
    visitorId
    dateOfTaking
    dateOfReturn='-'
    constructor(_bookId, _visitorId, _date)
    {
        this.bookId=_bookId
        this.visitorId = _visitorId
        this.dateOfTaking = _date
    }
    clone(card)
    {
        this.id=card.id
        this.bookId=card.bookId
        this.visitorId = card.visitorId
        this.dateOfTaking = card.dateOfTaking
        this.dateOfReturn =card.dateOfReturn
    }
}


let bookSet = new Array()
let visitorSet = new Array()
let cardSet = new Array()

function setObjectToSave(obj)
{
    if(obj instanceof Book)
    {
        saveObject(bookSet,obj,'book')
    }
    else if(obj instanceof Visitor)
    {
        saveObject(visitorSet,obj,'visitor')
    }
    else if(obj instanceof Card)
    {
        saveObject(cardSet,obj,'card')
    }
    else {
        console.log('Incorrect object')
    }
}

function saveObject(collection, obj, objtype)
{
    let key
    if(obj.id==0)
    {
        if(collection.length!==0)
        {
            let maxid=0
            for(let el of collection)
            {
                if(maxid<el.id)
                {
                    maxid=el.id
                }
            }
            obj.id=maxid+1
            collection.push(obj)
        }
        else
        {
            obj.id=1
            collection.push(obj)
        }
    }
    else{
        for(let i=0; i<collection.length;i++)
        {
            if(collection[i].id==obj.id)
            {
                collection[i]=obj
            }
        }
    } 
    if(obj.id!=undefined)
    {
        let res = JSON.stringify(obj)
        key = objtype+obj.id
        window.localStorage.removeItem(key)
        window.localStorage.setItem(key, res)
    }
    
}


function loadObject(key)
{
    let res = window.localStorage.getItem(key)
    return JSON.parse(res)
}

function loadToVisitors()
{
   
    for(let i=0; i<window.localStorage.length;i++)
    {
        if(window.localStorage.key(i).includes(Viskey))
        {
            let obj = loadObject(window.localStorage.key(i))
            addVisitorToTable(obj)
            visitorSet.push(obj)
        }
    }
}

function loadToBook()
{
    for(let i=0; i<window.localStorage.length;i++)
    {
        if(window.localStorage.key(i).includes(Bookkey))
        {
            let obj = loadObject(window.localStorage.key(i))
            addBookToTable(obj)
            bookSet.push(obj)
        }
    }
}
function loadToVisitorSet()
{
    for(let i=0; i<window.localStorage.length;i++)
    {
        if(window.localStorage.key(i).includes(Viskey))
        {
            let obj = loadObject(window.localStorage.key(i))
            visitorSet.push(obj)
        }
    }
}

function loadToBookSet()
{
    for(let i=0; i<window.localStorage.length;i++)
    {
        if(window.localStorage.key(i).includes(Bookkey))
        {
            let obj = loadObject(window.localStorage.key(i))
            bookSet.push(obj)
        }
    }
}

function loadStat()
{
    loadToVisitorSet()
    loadToBookSet()
    sortVisitorByActive()
    sortBookByRate()
    let visitors = document.querySelectorAll('#visitors>h5')
    let books = document.querySelectorAll('#books>h5')
    for(let i=0;i<5;i++)
    {
        visitors[i].innerHTML=(i+1)+'. '+visitorSet[i].fullName
        books[i].innerHTML=(i+1)+'. '+bookSet[i].bookname
    }
}

function loadToCards()
{
    for(let i=0; i<window.localStorage.length;i++)
    {
        if(window.localStorage.key(i).includes(Cardkey))
        {
            let obj = loadObject(window.localStorage.key(i))
            addCardToTable(obj)
            cardSet.push(obj)
        }
    }
}





function loadCardAddInfo()
{
    loadToVisitorSet()
    loadToBookSet()
    let visSelect = document.querySelector('#vis')
    let bookSelect = document.querySelector('#book')
    let edvisSelect = document.querySelector('#editvis')
    let edbookSelect = document.querySelector('#editbook')
    for(let vis of visitorSet)
    {
        let op = document.createElement('option')
        op.value=vis.id
        op.innerHTML=vis.fullName
        visSelect.append(op)
    }
    for(let vis of visitorSet)
    {
        let op = document.createElement('option')
        op.value=vis.id
        op.innerHTML=vis.fullName
        edvisSelect.append(op)
    }
    for(let book of bookSet)
    {
        let op = document.createElement('option')
        op.value=book.id
        op.innerHTML=book.bookname
        bookSelect.append(op)
    }
    for(let book of bookSet)
    {
        let op = document.createElement('option')
        op.value=book.id
        op.innerHTML=book.bookname
        edbookSelect.append(op)
    }
}


//Visitor
function addVisitor()
{
    let fullname = document.querySelector('#fullname').value
    let phone = document.querySelector('#phone').value
    
    if(!/^[A-Z]+[a-z]+\s+[A-z]+[a-z]+(\s*[A-z]*[a-z]*)?$/.test(fullname)){
        document.querySelector('#errorname').innerHTML='* Неправельний ПІБ'
        document.querySelector('#errorname').hidden=false
        return
    }
    
    let phoneReg=/^\d{10,12}$/
    if(!phoneReg.test(phone)){
        document.querySelector('#errorphone').innerHTML='* Неправельний номер телефону'
        document.querySelector('#errorphone').hidden=false
        return
    }
    document.querySelector('#fullname').value=''
    document.querySelector('#phone').value=''
    let res = new Visitor(fullname, phone)
    setObjectToSave(res)
    addVisitorToTable(res)
}

function editVisitor(vid, nd)
{
    let fullname = document.querySelector('#editfullname').value
    let phone = document.querySelector('#editphone').value
    if(!/^[A-Z]+[a-z]+\s+[A-z]+[a-z]+(\s*[A-z]*[a-z]*)?$/.test(fullname)){
        document.querySelector('#ederrorname').innerHTML='* Неправельний ПІБ'
        document.querySelector('#ederrorname').hidden=false
        return
    }
    
    let phoneReg=/^\d{10,12}$/
    if(!phoneReg.test(phone)){
        document.querySelector('#ederrorphone').innerHTML='* Неправельний номер телефону'
        document.querySelector('#ederrorphone').hidden=false
        return
    }
    let res = new Visitor(fullname, phone)
    let user
    for(let vis of visitorSet)
    {
        if(vis.id==vid)
        {
            user=vis
            break
        }
    }
    res.id=user.id
    res.active=user.active
    setObjectToSave(res)
    let td = nd.childNodes
    td[0].innerHTML=res.id
    td[1].innerHTML=res.fullName
    td[2].innerHTML=res.phone
}

function showEditVisitor()
{
    let id = event.target.id
    let name = document.querySelector('#editfullname')
    let phone = document.querySelector('#editphone')
    objID=id
    let user
    for(let vis of visitorSet)
    {
        if(vis.id==id)
        {
            user=vis
            break
        }
    }
    name.value=user.fullName
    phone.value=user.phone
    nodde = event.target.parentNode.parentNode
}
function starteditVisitor()
{
    editVisitor(objId,nodde)
}

function searchVisitor()
{
    console.log('start search')
    let searchtype = document.querySelector('#sortSelect').value
    let tds
    let searchId
    switch(searchtype)
    {
        case 'id':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(1)')
            searchId=0
            break
        case 'name':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(2)')
            searchId=1
            break
        case 'phone':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(3)')
            searchId=2
            break
    }
    let resDiv = document.querySelector('#resDiv')
    if(resDiv.childNodes.length!=0)
    {
        while (resDiv.firstChild) {
            resDiv.removeChild(resDiv.lastChild);
        }
    }
    let searchWord = document.querySelector('#search').value.toLowerCase()
    let trs = document.querySelectorAll('tbody>tr')
    for(let tr of trs)
    {
                if(tr.childNodes[searchId].toLowerCase().includes(searchWord))
                {
                    let pId = document.createElement('p')
                    let pName = document.createElement('p')
                    let pPhone = document.createElement('p')
                    let buttonEdit = document.createElement('button')
    
                    buttonEdit.classList.add('btn')
                    buttonEdit.classList.add('btn-dark')
                    buttonEdit.addEventListener('click',showEditVisitor)
                    buttonEdit.innerHTML='-'
                    buttonEdit.id=tr.childNodes[0].innerHTML
                    buttonEdit.setAttribute('data-bs-toggle','modal')
                    buttonEdit.setAttribute('data-bs-target','#editmodal')

                    pId.innerHTML="ID: "+tr.childNodes[0].innerHTML
                    pId.style.marginTop='1vh'
                    pName.innerHTML="ПІБ: "+tr.childNodes[1].innerHTML
                    pPhone.innerHTML="Телефон: "+tr.childNodes[2].innerHTML
                    resDiv.appendChild(pId)
                    resDiv.appendChild(pName)
                    resDiv.appendChild(pPhone)
                    resDiv.appendChild(buttonEdit)
                }
    } 
}


//Book
function addBook()
{
    let name = document.querySelector('#name').value
    let author = document.querySelector('#author').value
    let year = document.querySelector('#year').value
    let publisher = document.querySelector('#publisher').value
    let pages = document.querySelector('#pages').value
    let copies = document.querySelector('#copies').value
    if(/^\s+$/.test(name))
    {
        document.querySelector('#errorname').innerHTML='* Пусте поле'
        document.querySelector('#errorname').hidden=false
        return
    }
    if(/^\s+$/.test(author))
    {
        document.querySelector('#errorauthor').innerHTML='* Неправильне ім\'я автора'
        document.querySelector('#errorauthor').hidden=false
        return
    }
    let now = new Date()
    if(year>now.getFullYear())
    {
        document.querySelector('#erroryear').innerHTML='* Рік більший за поточний'
        document.querySelector('#erroryear').hidden=false
        return
    }
    if(/^\s+$/.test(publisher))
    {
        document.querySelector('#errorpublish').innerHTML='* Пусте поле'
        document.querySelector('#errorpublish').hidden=false
        return
    }
    document.querySelector('#name').value=''
    document.querySelector('#author').value=''
    document.querySelector('#year').value=''
    document.querySelector('#publisher').value=''
    document.querySelector('#pages').value=''
    document.querySelector('#copies').value=''
    let res = new Book(name,author,year,publisher,pages,copies)
    setObjectToSave(res)
    addBookToTable(res)

}

function editBook(id, node){
    let name = document.querySelector('#editname').value
    let author = document.querySelector('#editauthor').value
    let year = document.querySelector('#edityear').value
    let publisher = document.querySelector('#editpublisher').value
    let pages = document.querySelector('#editpages').value
    let copies = document.querySelector('#editcopies').value

    if(/^\s+$/.test(name))
    {
        document.querySelector('#ederrorname').innerHTML='* Пусте поле'
        document.querySelector('#ederrorname').hidden=false
        return
    }
    if(/^\s+$/.test(author))
    {
        document.querySelector('#ederrorauthor').innerHTML='* Неправильне ім\'я автора'
        document.querySelector('#ederrorauthor').hidden=false
        return
    }
    let now = new Date()
    if(year>now.getFullYear())
    {
        document.querySelector('#ederroryear').innerHTML='* Рік більший за поточний'
        document.querySelector('#ederroryear').hidden=false
        return
    }
    if(/^\s+$/.test(publisher))
    {
        document.querySelector('#ederrorpublish').innerHTML='* Пусте поле'
        document.querySelector('#ederrorpublish').hidden=false
        return
    }
    let res = new Book(name,author,year,publisher,pages,copies)
    let book
    for(let bk of bookSet)
    {
        if(bk.id==id)
        {
            book=bk
            break
        }
    }
    console.log(book)
    res.id=book.id
    res.rate=book.rate
    setObjectToSave(res)
    let td = node.childNodes
    td[0].innerHTML=res.id
    td[1].innerHTML=res.bookname
    td[2].innerHTML=res.author
    td[3].innerHTML=res.yearOfPublication
    td[4].innerHTML=res.publisher
    td[5].innerHTML=res.pages
    td[6].innerHTML=res.copies
}
function showEditBook()
{
    let id = event.target.id
    let name = document.querySelector('#editname')
    let author = document.querySelector('#editauthor')
    let year = document.querySelector('#edityear')
    let publisher = document.querySelector('#editpublisher')
    let pages = document.querySelector('#editpages')
    let copies = document.querySelector('#editcopies')
    objId=id
    let book
    for(let bk of bookSet)
    {
        if(bk.id==id)
        {
            book=bk
            break
        }
    }
    name.value=book.bookname
    author.value=book.author
    year.value=book.yearOfPublication
    publisher.value=book.publisher
    pages.value=book.pages
    copies.value=book.copies
    nodde = event.target.parentNode.parentNode
}
function startEditBook()
{
    editBook(objId,nodde)
}
function searchBook()
{
    let searchtype = document.querySelector('#sortSelect').value
    let searchId
    switch(searchtype)
    {
        case 'id':
            searchId=0
            break
        case 'name':
            searchId=1
            break
        case 'author':
            searchId=2
            break
        case 'year':
            searchId=3
            break
        case 'publisher':
            searchId=4
            break
        case 'pages':
            searchId=5
            break
        case 'copies':
            searchId=6
            break
    }
    let resDiv = document.querySelector('#resDiv')
    if(resDiv.childNodes.length!=0)
    {
        while (resDiv.firstChild) {
            resDiv.removeChild(resDiv.lastChild);
        }
    }
    console.log('start')
    let searchWord = document.querySelector('#search').value.toLowerCase()
    let trs = document.querySelectorAll('tbody>tr')
        for(let tr of trs)
        {
                if(tr.childNodes[searchId].innerHTML.toLowerCase().includes(searchWord))
                {
                   
                    let pId = document.createElement('p')
                    pId.innerHTML="ID: "+tr.childNodes[0].innerHTML
                    let pName = document.createElement('p')
                    let pAuthor = document.createElement('p')
                    let pYear = document.createElement('p')
                    let pPublisher= document.createElement('p')
                    let pPages = document.createElement('p')
                    let pCopies = document.createElement('p')
                    let buttonEdit = document.createElement('button')
                        
                    buttonEdit.classList.add('btn')
                    buttonEdit.classList.add('btn-dark')
                    buttonEdit.addEventListener('click',showEditBook)
                    buttonEdit.innerHTML='-'
                    buttonEdit.id=tr.childNodes[0].innerHTML
                    buttonEdit.setAttribute('data-bs-toggle','modal')
                    buttonEdit.setAttribute('data-bs-target','#editmodal')
                    
                    pId.style.marginTop='1vh'
                    pName.innerHTML="Назва книги: "+tr.childNodes[1].innerHTML
                    pAuthor.innerHTML="Автор: "+tr.childNodes[2].innerHTML
                    pYear.innerHTML="Рік видання: "+tr.childNodes[3].innerHTML
                    pPublisher.innerHTML="Видавець: "+tr.childNodes[4].innerHTML
                    pPages.innerHTML="Кількість сторінок: "+tr.childNodes[5].innerHTML
                    pCopies.innerHTML="Кількість копій: "+tr.childNodes[6].innerHTML
                        
                        
                    resDiv.appendChild(pId)
                    resDiv.appendChild(pName)
                    resDiv.appendChild(pAuthor)
                    resDiv.appendChild(pYear)
                    resDiv.appendChild(pPublisher)
                    resDiv.appendChild(pPages)
                    resDiv.appendChild(pCopies)
                    resDiv.appendChild(buttonEdit)
                }
        } 
}
function deleteBook()
{
    let parent = nodde.parentNode
    parent.removeChild(nodde)
    window.localStorage.removeItem(Bookkey+objId)
}


//Card
function setReturnDate()
{
    console.log('start')
    let nowdt = new Date()
    let dt= nowdt.toLocaleDateString()
    let id = event.target.id
    event.target.innerHTML=dt
    let card
    for(let c of cardSet)
    {
        if(c.id==id)
        {
            card=c
            c.dateOfReturn=dt
            break
        }
    }
    card.dateOfReturn=dt
    let newcard = new Card()
    newcard.clone(card)
    let bk
    for(let i=0;i< bookSet.length;i++)
    {
        if(bookSet[i].id==card.bookId)
        {
            bk=bookSet[i]
            ++bk.copies
            let newbook = new Book()
            newbook.clone(bk)
            setObjectToSave(newbook)
            bookSet[i]=newbook
            break
        }
    }
    setObjectToSave(newcard)
}
function addCard()
{
    let visId = document.querySelector('#vis').value
    let bookId = document.querySelector('#book').value
    let vis
    let bk
    console.log('selected visID:'+visId)
    console.log('selected bookID:'+bookId)
    for(let i=0;i< bookSet.length;i++)
    {
        if(bookSet[i].id==bookId)
        {
            if(bookSet[i].copies==0)
            {
                alert('Книг не залишилося')
                return
            }
            console.log("bookId: "+bookSet[i].id)
            console.log(bookSet[i].bookname)
            bk=bookSet[i]
            ++bk.rate
            --bk.copies
            let newbook = new Book()
            newbook.clone(bk)
            setObjectToSave(newbook)
            bookSet[i]=newbook
            break
        }
    }
    for(let i=0;i< visitorSet.length;i++)
    {
        if(visitorSet[i].id==visId)
        {
            console.log("visId: "+visitorSet[i].id)
            console.log(visitorSet[i].fullName)
            vis=visitorSet[i]
            ++vis.active
            let newvis = new Visitor()
            newvis.clone(vis)
            setObjectToSave(newvis)
            visitorSet[i]=newvis
            break
        }
    }
    
    let dt = new Date
    let takeDate = dt.toLocaleDateString()
    let res = new Card(bk.id, vis.id, takeDate)
    console.log('card: ',res)
    setObjectToSave(res)
    addCardToTable(res)
}

function editCard(id, node){
    let visId = document.querySelector('#editvis').value
    let bookId = document.querySelector('#editbook').value
    let date = document.querySelector('#editdate').value
    let nowdt = new Date()
    if(date>nowdt.getFullYear())
    {
        document.querySelector('#editdate').innerHTML='* Дата більша за поточну'
        document.querySelector('#editdate').hidden=false
        return
    }
    let res = new Card(visId, bookId)
    res.dateOfTaking=date
    let card
    for(let cd of cardSet)
    {
        if(cd.id==id)
        {
            card=cd
            break
        }
    }
    res.id=id
    res.dateOfReturn = card.dateOfReturn 
    setObjectToSave(res)
    let td = node.childNodes
    td[0].innerHTML=res.id
    let user=null
    for(let vis of visitorSet)
    {
        if(vis.id==visId)
        {
            user=vis.fullName
            break
        }
    }
    let book=null
    for(let bk of bookSet)
    {
        if(bk.id==bookId)
        {
            book=bk.bookname
            break
        }
    }
    if(user!=null && book!=null)
    {
        td[1].innerHTML=user
        td[2].innerHTML=book
        td[3].innerHTML=res.dateOfTaking
        td[4].innerHTML=res.dateOfReturn
    }
}
function startEditCard()
{
    editCard(objId,nodde)
}

function reversedate(date)
{

    if(date.includes('-'))
    {
        return date
    }
    else
    {
        let splitstring = date.split('.')
        let datecomponentarr = [splitstring[2],splitstring[1],splitstring[0]]
        let res = datecomponentarr.join('-')
        return res
    }
}
function showEditCard()
{
    let id=event.target.id
    let visId = document.querySelector('#editvis')
    let bookId = document.querySelector('#editbook')
    let date = document.querySelector('#editdate')
    objId=id
    let card
    for(let cd of cardSet)
    {
        if(cd.id==id)
        {
            card=cd
            break
        }
    }
    visId.value=card.visitorId
    bookId.value=card.bookId
    date.value = reversedate(card.dateOfTaking)
    nodde = event.target.parentNode.parentNode
}

function searchCard()
{
    console.log('start search')
    let searchtype = document.querySelector('#sortSelect').value
    let tds
    let searchId
    switch(searchtype)
    {
        case 'id':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(1)')
            searchId=0
            break
        case 'visitors':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(2)')
            searchId=1
            break
        case 'books':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(3)')
            searchId=2
            break
        case 'takeDate':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(4)')
            searchId=3
            break
        case 'returnDate':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(5)')
            searchId=4
            break
    }
    let resDiv = document.querySelector('#resDiv')
    if(resDiv.childNodes.length!=0)
    {
        while (resDiv.firstChild) {
            resDiv.removeChild(resDiv.lastChild);
        }
    }
    let searchWord = document.querySelector('#search').value.toLowerCase()
    let trs = document.querySelectorAll('tbody>tr')
    for(let tr of trs)
    {
                if(tr.childNodes[searchId].toLowerCase().includes(searchWord))
                {
                    let pId = document.createElement('p')
                    let pVis = document.createElement('p')
                    let pBook = document.createElement('p')
                    let pDate = document.createElement('p')
                    let pReturnDate = document.createElement('p')

                    pReturnDate.addEventListener('click',setReturnDate)
                    pReturnDate.style.cursor='pointer'
                   
                    let buttonEdit = document.createElement('button')
                    buttonEdit.classList.add('btn')
                    buttonEdit.classList.add('btn-dark')
                    buttonEdit.addEventListener('click',showEditCard)
                    buttonEdit.innerHTML='-'
                    buttonEdit.id=tr.childNodes[0].innerHTML
                    buttonEdit.setAttribute('data-bs-toggle','modal')
                    buttonEdit.setAttribute('data-bs-target','#editmodal')

                    pId.innerHTML="ID: "+tr.childNodes[0].innerHTML
                    pId.style.marginTop='1vh'
                    pVis.innerHTML="Відвідувач: "+tr.childNodes[1].innerHTML
                    pBook.innerHTML="Книга: "+tr.childNodes[2].innerHTML
                    pDate.innerHTML="Дата взятя книги: "+tr.childNodes[3].innerHTML
                    pReturnDate.innerHTML="Дата повернення книги: "+tr.childNodes[4].innerHTML
                    
                    resDiv.appendChild(pId)
                    resDiv.appendChild(pVis)
                    resDiv.appendChild(pBook)
                    resDiv.appendChild(pDate)
                    resDiv.appendChild(pReturnDate)
                    resDiv.appendChild(buttonEdit)
                }
    } 
}


// Візуалізація

function addCardToTable(card)
{
    console.log(card)
    let tdId = document.createElement('td')
    let tdVis = document.createElement('td')
    let tdBook = document.createElement('td')
    let tdTakeDate = document.createElement('td')
    let tdReturnDate = document.createElement('td')
    let tdEdit = document.createElement('td')
    
    let buttonEdit = document.createElement('button')
    
    buttonEdit.classList.add('btn')
    buttonEdit.classList.add('btn-dark')
    buttonEdit.addEventListener('click',showEditCard)
    buttonEdit.innerHTML='-'
    buttonEdit.id=card.id
    buttonEdit.setAttribute('data-bs-toggle','modal')
    buttonEdit.setAttribute('data-bs-target','#editmodal')
    
    tdId.innerHTML=card.id

    let user=null
    for(let vis of visitorSet)
    {
        if(vis.id==card.visitorId)
        {
            console.log('addblock visitor: '+vis.fullName)
            console.log('addblock visitorID: '+vis.id)
            user=vis
            break
        }
    }
    let book=null
    for(let bk of bookSet)
    {
        if(bk.id==card.bookId)
        {
            console.log('addblock book: '+bk.bookname)
            console.log('addblock bookID: '+bk.id)
            book=bk
            break
        }
    }
    if(user!=null && book!=null)
    {
        tdVis.innerHTML=user.fullName
        tdBook.innerHTML=book.bookname
        tdTakeDate.innerHTML=card.dateOfTaking

        tdReturnDate.innerHTML=card.dateOfReturn
        tdReturnDate.id=card.id
        tdReturnDate.style.cursor='pointer'
        tdReturnDate.addEventListener('click',setReturnDate)

        tdEdit.append(buttonEdit)

        let tr= document.createElement('tr')
        tr.append(tdId, tdVis, tdBook, tdTakeDate, tdReturnDate,tdEdit)
        document.querySelector('tbody').appendChild(tr)
    }
    

}
function addBookToTable(book)
{
    let tdId = document.createElement('td')
    let tdName = document.createElement('td')
    let tdAuthor = document.createElement('td')
    let tdPublisher = document.createElement('td')
    let tdYear = document.createElement('td')
    let tdPages = document.createElement('td')
    let tdCopies = document.createElement('td')
   
    let tdEdit = document.createElement('td')
    let buttonEdit = document.createElement('button')
    
    buttonEdit.classList.add('btn')
    buttonEdit.classList.add('btn-dark')
    buttonEdit.addEventListener('click',showEditBook)
    buttonEdit.innerHTML='-'
    buttonEdit.id=book.id
    buttonEdit.setAttribute('data-bs-toggle','modal')
    buttonEdit.setAttribute('data-bs-target','#editmodal')

    tdId.innerHTML=book.id
    tdName.innerHTML=book.bookname
    tdAuthor.innerHTML=book.author
    tdPublisher.innerHTML=book.publisher
    tdYear.innerHTML=book.yearOfPublication
    tdPages.innerHTML=book.pages
    tdCopies.innerHTML=book.copies
    tdEdit.append(buttonEdit)

    let tr=document.createElement('tr')
    tr.append(tdId,tdName,tdAuthor,tdYear,tdPublisher,tdPages,tdCopies,tdEdit)
    document.querySelector('tbody').appendChild(tr)


}
function addVisitorToTable(vis)
{
    let tdId = document.createElement('td')
    let tdName = document.createElement('td')
    let tdPhone = document.createElement('td')
    let tdEdit = document.createElement('td')
    let buttonEdit = document.createElement('button')
    
    buttonEdit.classList.add('btn')
    buttonEdit.classList.add('btn-dark')
    buttonEdit.addEventListener('click',showEditVisitor)
    buttonEdit.innerHTML='-'
    buttonEdit.id=vis.id
    buttonEdit.setAttribute('data-bs-toggle','modal')
    buttonEdit.setAttribute('data-bs-target','#editmodal')

    tdId.innerHTML=vis.id
    tdName.innerHTML=vis.fullName
    tdPhone.innerHTML=vis.phone
    tdEdit.append(buttonEdit)
    let tr= document.createElement('tr')
    tr.append(tdId,tdName,tdPhone,tdEdit)
    document.querySelector('tbody').appendChild(tr)
}

// Сортування
function sortArr(arr)
{
    let change=true
    let temp
    if(!isNaN(arr[0]))
    {
        for(let i=0; i<arr.length;i++)
        {
            arr[i]=parseInt(arr[i])
        }
    }
    for (let i = 0, endI = arr.length - 1; i < endI; i++) {
        change = false;
        for (let j = 0, endJ = endI - i; j < endJ; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                change = true;
            }
        }
        if (!change) break;
    }
    return arr
}
function sortVisitorByActive()
{
    let change=true
    let temp
    for (let i = 0, endI = visitorSet.length - 1; i < endI; i++) {
        change = false;
        for (let j = 0, endJ = endI - i; j < endJ; j++) {
            if (visitorSet[j].active < visitorSet[j + 1].active) {
                temp = visitorSet[j];
                visitorSet[j] = visitorSet[j + 1];
                visitorSet[j + 1] = temp;
                change = true;
            }
        }
        if (!change) break;
    }
}
function sortBookByRate()
{
    let change=true
    let temp
    for (let i = 0, endI = bookSet.length - 1; i < endI; i++) {
        change = false;
        for (let j = 0, endJ = endI - i; j < endJ; j++) {
            if (bookSet[j].active < bookSet[j + 1].active) {
                temp = bookSet[j];
                bookSet[j] = bookSet[j + 1];
                bookSet[j + 1] = temp;
                change = true;
            }
        }
        if (!change) break;
    }
}

function sortVisitor()
{
    let sorttype = document.querySelector('#sortSelect').value
    let tds
    let sortarr = new Array()
    let sortTdid
    switch(sorttype)
    {
        case 'id':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(1)')
            sortTdid=0
            break
        case 'name':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(2)')
            sortTdid=1
            break
        case 'phone':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(3)')
            sortTdid=2
            break
    }
    for(let td of tds)
    {
        sortarr.push(td.innerHTML)
    }
    let trs = document.querySelectorAll('tbody>tr')
    sortarr= sortArr(sortarr)
    let sortedarr = new Array()
    for(let i=0;i<sortarr.length;i++)
    {
        for(let j=0; j<trs.length;j++)
        {
            if(sortarr[i]==trs[j].childNodes[sortTdid].innerHTML)
            {
                sortedarr.push(trs[j])
            }
        }
    }
    let tbody = document.querySelector('tbody')
    for(let sortel of sortedarr)
    {
        tbody.append(sortel)
    }
}
function sortBook()
{
    let sorttype = document.querySelector('#sortSelect').value
    let tds
    let sortarr = new Array()
    let sortTdid
    switch(sorttype)
    {
        case 'id':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(1)')
            sortTdid=0
            break
        case 'name':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(2)')
            sortTdid=1
            break
        case 'author':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(3)')
            sortTdid=2
            break
        case 'year':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(4)')
            sortTdid=3
            break
        case 'publisher':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(5)')
            sortTdid=4
            break
        case 'pages':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(6)')
            sortTdid=5
            break
        case 'copies':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(7)')
            sortTdid=6
            break
    }
    for(let td of tds)
    {
        sortarr.push(td.innerHTML)
    }
    let trs = document.querySelectorAll('tbody>tr')
    sortarr= sortArr(sortarr)
    let sortedarr = new Array()
    for(let i=0;i<sortarr.length;i++)
    {
        for(let j=0; j<trs.length;j++)
        {
            if(sortarr[i]==trs[j].childNodes[sortTdid].innerHTML)
            {
                sortedarr.push(trs[j])
            }
        }
    }
    let tbody = document.querySelector('tbody')
    for(let sortel of sortedarr)
    {
        tbody.append(sortel)
    }
}
function sortCard()
{
    let sorttype = document.querySelector('#sortSelect').value
    let tds
    let sortarr = new Array()
    let sortTdid
    switch(sorttype)
    {
        case 'id':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(1)')
            sortTdid=0
            break
        case 'visitors':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(2)')
            sortTdid=1
            break
        case 'books':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(3)')
            sortTdid=2
            break
        case 'takeDate':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(4)')
            sortTdid=3
            break
        case 'returnDate':
            tds=document.querySelectorAll('tbody>tr>td:nth-child(5)')
            sortTdid=4
            break
    }
    for(let td of tds)
    {
        sortarr.push(td.innerHTML)
    }
    let trs = document.querySelectorAll('tbody>tr')
    sortarr= sortArr(sortarr)
    let sortedarr = new Array()
    for(let i=0;i<sortarr.length;i++)
    {
        for(let j=0; j<trs.length;j++)
        {
            if(sortarr[i]==trs[j].childNodes[sortTdid].innerHTML)
            {
                sortedarr.push(trs[j])
            }
        }
    }
    let tbody = document.querySelector('tbody')
    for(let sortel of sortedarr)
    {
        tbody.append(sortel)
    }
}


window.addEventListener('load',function(){
    let docTitle = this.document.title
    switch(docTitle)
    {
        case 'Книги':
            loadToBook()
            break
        case 'Відвідувачі':
            loadToVisitors()
            break
        case 'Картки':
            loadCardAddInfo()
            loadToCards()
            break
        case 'Статистика':
            loadStat()
            break
        default:
            break        
    }
})


