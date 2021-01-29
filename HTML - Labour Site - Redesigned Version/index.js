function switchNavTog(x) {
  console.log("hello fuck you");
  main_heading = $(".navigation");
  main_heading.innerHTML =  '<nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Act Map</a>
      <form class="form-inline my-2 my-lg-0">
        <button class="btn submit-btn btn-outline-success my-2 my-sm-0" type="submit">Login</button>
      </form>

      <div id = "toggler-nav">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active mx-4">
            <a class="nav-link" href="#"> <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item mx-4">
            <a class="nav-link" href="#">List of Actions</a>
          </li>
          <li class="nav-item mx-4">
            <a class="nav-link" href="#">Donate</a>
          </li>
          <li class="nav-item mx-4 dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Media
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Twitter</a>
              <a class="dropdown-item" href="#">Instagram</a>
              <a class="dropdown-item" href="#">Facebook</a>
            </div>
          </li>
          <li class="nav-item mx-4">
            <a class="nav-link disabled" href="#">Contact Us</a>
          </li>
        </ul>
      </div>
      <div id = "login-btn">

      </div>

    </nav>'
  }
}


var x = window.matchMedia("(max-width: 991px)")
switchNavTog(x)
x.addListener(switchNavTog)
