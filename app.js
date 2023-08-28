let mockAPI = new URL("https://644435db914c816083b638ce.mockapi.io/LegoSets");

//$.get("https://644435db914c816083b638ce.mockapi.io/LegoSets", (data) => console.log(data));


$.get(mockAPI).then(LegoSet => {
    LegoSet.map(SetName => {
      $('tbody').append(
        $(`
        <tr>
          <td>${LegoSet.setName}</td>
          <td>${LegoSet.theme}</td>
        </tr>
        `)
      )
  
    })
  })