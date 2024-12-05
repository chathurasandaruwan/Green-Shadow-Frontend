$(document).ready(function () {
    loadTable();
    refreshFields();
    $("#cropImgSelector").on("change", function (event) {
        event.preventDefault();
        const file = $("#cropImgSelector")[0].files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $("#previewImage").attr("src", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    })
    $('#btnClear').on('click', () => {
        clearInputs();

    });
    function clearInputs() {
        let btnText = $("#btnClear").text()
        $('#commonNameTxt').val("");
        $('#scientificNameTxt').val("");
        $('#dropdownCategory').val("");
        $('#dropdownFieldName').val("");
        $('input[name="customRadioInline1"]').prop('checked', false);
        $('#cropImgSelector').val('');
        $('#previewImage').attr("src", "");
        if (btnText === "Cancel") {
            $("#btnClear").text("Clear");
            $("#btnSave").text("Save");
            $("#btnSave").removeClass("btn-warning");
            $("#btnSave").addClass("btn-primary");
        }
    }
    $('#btnSave').on('click', () => {
        let btnText = $("#btnSave").text()
        var commonName = $('#commonNameTxt').val();
        var scientificName = $('#scientificNameTxt').val();
        var category = $('#dropdownCategory').val();
        var fieldCode = $('#dropdownFieldName').val();
        var season = $('input[name="customRadioInline1"]:checked').val();
        var img = $('#imageInput').val();

        const fileInput = $('#cropImgSelector')[0]; // Access the DOM element
        const file = fileInput.files[0];

        // image encode to base64
        /*if (file) {
            const reader = new FileReader();

            // Callback for when the file is loaded
            reader.onload = function (e) {
                const base64String = e.target.result; // Get Base64 string
                console.log("Base64 String: ", base64String);
            };

            // Read the file as a data URL (Base64 encoded string)
            reader.readAsDataURL(file);
        } else {
            console.log("No file selected");
        }*/


        //save data
        let formData = new FormData();
        if (btnText === "Save") {
            formData.append("common_name", commonName);
            formData.append("scientific_name", scientificName);
            formData.append("image", file);
            formData.append("category", category);
            formData.append("season", season);
            formData.append("field_code", fieldCode);
            $.ajax({
                method:"POST",
                contentType: false,
                processData: false,
                url:"http://localhost:5050/CropMonitoringSystem/api/v1/crop",
                async:true,
                data:formData,
                success:function (data){
                    clearInputs();
                    loadTable();
                    iziToast.success({
                        title: 'Success!',
                        message: 'Crop has been Saved successfully..!',
                        position: 'bottomRight',
                        timeout: 5000,
                        progressBar: true,
                        class: 'custom-iziToast',
                    });
                },
                error:function (){
                    iziToast.error({
                        title: 'Error!',
                        message: 'Crop not saved ..!',
                        position: 'bottomRight',
                        timeout: 5000,
                        progressBar: true,
                        class: 'custom-iziToast',
                    });
                }
            })

        }else {
            //update data
            iziToast.show({
                title: 'Do you want to Update this crop?',
                message: 'Click the button below to confirm.',
                position: 'topCenter',
                class: 'custom-iziToast-btn',
                timeout: false, // Stays on screen until user interacts
                buttons: [
                    ['<button>Confirm</button>', function (instance, toast) {
                        getCropIdByName(commonName, function (cropCode) {
                            if (cropCode) {
                                formData.append("common_name", commonName);
                                formData.append("scientific_name", scientificName);
                                formData.append("category", category);
                                formData.append("season", season);
                                formData.append("field_code", fieldCode);
                                if (!file){
                                    formData.append('image', convertBase64StringToFile(img));
                                }else {
                                    formData.append("image", file);
                                }
                                $.ajax({
                                    type: 'PUT',
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    url:"http://localhost:5050/CropMonitoringSystem/api/v1/crop/"+cropCode,
                                    success:function (data){
                                        clearInputs();
                                        loadTable();
                                        iziToast.success({
                                            title: 'Success!',
                                            message: 'Crop has been Updated successfully..!',
                                            position: 'bottomRight',
                                            timeout: 5000,
                                            progressBar: true,
                                            class: 'custom-iziToast',
                                        });
                                    },
                                    error:function (){
                                        iziToast.error({
                                            title: 'Error!',
                                            message: 'Crop not Updated ..!',
                                            position: 'bottomRight',
                                            timeout: 5000,
                                            progressBar: true,
                                            class: 'custom-iziToast',
                                        });
                                    }
                                })
                            } else {
                                iziToast.error({
                                    title: 'Error!',
                                    message: 'Crop not found ..!',
                                    position: 'bottomRight',
                                    timeout: 5000,
                                    progressBar: true,
                                    class: 'custom-iziToast',
                                });
                            }
                        });

                        instance.hide({ transitionOut: 'fadeOut' }, toast);
                    }],
                    ['<button>Cancel</button>', function (instance, toast) {
                        instance.hide({ transitionOut: 'fadeOut' }, toast);
                    }]
                ]
            });
        }
    });
    function convertBase64StringToFile(base64String) {
        try {
            const base64Data = base64String.includes(",") ? base64String.split(",")[1] : base64String;
            const byteCharacters = atob(base64Data);

            //Convert decoded data into an array of bytes
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                const slice = byteCharacters.slice(offset, offset + 1024);
                const byteNumbers = new Array(slice.length);

                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            // Create a Blob from the byte arrays
            const blob = new Blob(byteArrays, { type: 'image/jpeg' });

            // Convert the Blob into a File
            const file = new File([blob], "imageOne.jpg", { type: 'image/jpeg' });

            return file;
        } catch (error) {
            throw error;
        }
    }

    $("#cropTbl").on('click','tr',function (){
        let commonName = $(this).find("#commonNameValue").text();
        let scientificName = $(this).find("#scientificNameValue").text();
        let category = $(this).find("#categoryValue").text();
        let fieldName = $(this).find("#fieldNameValue").text();
        let season = $(this).find("#seasonValue").text();
        let img = $(this).find("#cropImgValue img").attr("src");

        $('#commonNameTxt').val(commonName);
        $('#scientificNameTxt').val(scientificName);
        $('#dropdownCategory').val(category);
        $('#dropdownFieldName').val(fieldName);
        // Set the appropriate radio button based on season
        $('input[name="customRadioInline1"]').each(function () {
            $(this).prop('checked', $(this).val() === season);
        });
        // Set the image source
        $('#previewImage').attr("src", img);
        $('#imageInput').val(img);


        $("#btnSave").text("Update");
        $("#btnSave").removeClass("btn-primary");
        $("#btnSave").addClass("btn-warning");
        $("#btnClear").text("Cancel");
    });
    //delete crop
    $("#cropTbl").on('click', '.deleteBtn', function (e) {
        e.preventDefault();
        e.stopPropagation();
        let cropName = $(this).parent().parent().find("#commonNameValue").text();
        iziToast.show({
            title: 'Do you want to delete this crop?',
            message: 'Click the button below to confirm.',
            position: 'topCenter',
            class: 'custom-iziToast-btn',
            timeout: false, // Stays on screen until user interacts
            buttons: [
                ['<button>Confirm</button>', function (instance, toast) {
                    getCropIdByName(cropName, function (cropCode) {
                        if (cropCode) {
                            $.ajax({
                                method:"DELETE",
                                contentType:"text",
                                url:"http://localhost:5050/CropMonitoringSystem/api/v1/crop/"+cropCode,
                                async:true,
                                success:function (data){
                                    loadTable();
                                    iziToast.success({
                                        title: 'Success!',
                                        message: 'Crop has been Deleted successfully..!',
                                        position: 'bottomRight',
                                        timeout: 5000,
                                        progressBar: true,
                                        class: 'custom-iziToast',
                                    });
                                },
                                error:function (){
                                    iziToast.error({
                                        title: 'Error!',
                                        message: 'Crop not Deleted ..!',
                                        position: 'bottomRight',
                                        timeout: 5000,
                                        progressBar: true,
                                        class: 'custom-iziToast',
                                    });
                                }
                            })
                        } else {
                            iziToast.error({
                                title: 'Error!',
                                message: 'Crop not found ..!',
                                position: 'bottomRight',
                                timeout: 5000,
                                progressBar: true,
                                class: 'custom-iziToast',
                            });
                        }
                    });
                    instance.hide({ transitionOut: 'fadeOut' }, toast);
                }],
                ['<button>Cancel</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast);
                }]
            ]
        });

    })
    function getCropIdByName(cropName, callback) {
        let cropCode = null;
        $.ajax({
            method: "GET",
            contentType: "application/json",
            url: "http://localhost:5050/CropMonitoringSystem/api/v1/crop/" + cropName,
            async: true,
            success: function (data) {
                // let cropCode = null;

                if (Array.isArray(data)) {
                    data.forEach((item) => {
                        cropCode = item.crop_code;
                    });
                } else {
                    // Handle the case where the data is not an array
                    cropCode = data.crop_code; // Adjust this based on the actual structure
                }
                callback(cropCode);
            },
            error: function () {
                alert("Error: Crop not found");
            }
        });

    }


    // loadTable
    function loadTable() {
        $('#cropTable-body').empty();

        $.ajax({
            method:"GET",
            contentType:"application/json",
            url:"http://localhost:5050/CropMonitoringSystem/api/v1/crop/getAllCrops",
            async:true,
            success:function (data){

                // sort to setOrderBy tempId
                data.map((item,index) =>{
                    const imageSrc = `data:image/png;base64,${item.image}`;
                    var record=`<tr>

            <td id="cropImgValue"><img src="${imageSrc}" class="img-fluid img-thumbnail" alt="Sheep"></td>
            <td id="commonNameValue">${item.commonName}</td>
            <td id="scientificNameValue">${item.scientific_name}</td>
            <td id="categoryValue">${item.category}</td>
            <td id="fieldNameValue">${item.field_code}</td>
            <td id="seasonValue">${item.season}</td>
            <td><a href="#" class=" btn deleteBtn ">Delete <i class="far fa-trash-alt"></i></a></td>
        </tr>`
                    $('#cropTable-body').append(record);
                });
            },
            error:function (){
                alert("Error from load table customer")
            }
        });
    }
    // load field name
     function refreshFields() {
        $('#dropdownFieldName').empty();
        let fieldArray = [];
        $.ajax({
            method:"GET",
            contentType:"application/json",
            url:"http://localhost:5050/CropMonitoringSystem/api/v1/field/getAllFields",
            async:true,
            success:function (data){
                fieldArray=data;
                $('#dropdownFieldName').append($('<option>', {
                    value: '',
                    disabled: true,
                    selected: true,
                    hidden: true,
                    text: 'Select Field Name'
                }));
                for (let i = 0; i < fieldArray.length; i++) {
                    $('#dropdownFieldName').append($('<option>', {
                        value: fieldArray[i].field_code,
                        text: fieldArray[i].fieldName
                    }));
                }

            },
            error:function (){
                alert("Error")
            }
        });
    }
});
