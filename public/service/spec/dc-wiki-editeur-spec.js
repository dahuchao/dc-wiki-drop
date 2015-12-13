describe("A suite", function () {
  it("Selection avec espace après", function () {
    motCle = ""

    var htmlElement = new Object()
    htmlElement.value = "xx xx xx texte xx xx xx";
    //                   01234567890123456789012
    //                            ^     ^
    htmlElement.selectionStart = 9
    htmlElement.selectionEnd = 15

    var element = new Array()
    element.push(htmlElement)

    var htmlRes = ajouterEncadrement(element, "[", "]", motCle)

    console.log(htmlRes)

    expect(htmlRes).toEqual("xx xx xx [texte] xx xx xx");
  })
  it("Selection sans espace après", function () {
    motCle = ""

    var htmlElement = new Object()
    htmlElement.value = "xx xx xx texte xx xx xx";
    //                   01234567890123456789012
    //                            ^    ^
    htmlElement.selectionStart = 9
    htmlElement.selectionEnd = 14

    var element = new Array()
    element.push(htmlElement)

    var htmlRes = ajouterEncadrement(element, "[", "]", motCle)

    console.log(htmlRes)

    expect(htmlRes).toEqual("xx xx xx [texte] xx xx xx");
  })
})
