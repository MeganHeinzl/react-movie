import React from 'react';
const API_KEY   = 'd2359d15ce61f09d9fad9392ebc96f04';

const GENRES = 'https://api.themoviedb.org/3/genre/movie/list?api_key='
             + API_KEY
             + '&language=en-US';
const IMG_URL = 'http://image.tmdb.org/t/p/w185';
class App extends React.Component {
    
    constructor() {
        super();
        this.state  = {
          apiKey : API_KEY,
          start  : '2018-01-01',
          end    : '2018-05-22',

          movies : [],
          genres : [],
          selectedGenre  : 28,
          page : 1,
          total_pages : null
        };
        this.getMovies = this.getMovies.bind(this);
        this.handleGenreChange = this.handleGenreChange.bind(this);
        this.changePageNext = this.changePageNext.bind(this);
        this.changePagePrev = this.changePagePrev.bind(this);

        
    }

    // Called when constructor is finished building component.
    componentDidMount() {
        this.getGenres();
        this.getMovies(this.state.selectedGenre, this.state.page);
    }
    //changes the genre when selected from drop down menu
    handleGenreChange(e) {
        this.setState({ selectedGenre: e.target.value })
        this.setState({page: 1})
        const GENRE = e.target.value;

      this.getMovies(GENRE, this.state.page);
    }
    //goes back a page
    changePagePrev(){
        if(this.state.page > 1){
            let newPage = this.state.page;
            newPage = newPage - 1;
            this.setState({page:newPage});
            this.getMovies(this.state.selectedGenre, newPage);
        }
    }

    //goes forward a page
    changePageNext(){
        if(this.state.page < this.state.total_pages){
            let newPage = this.state.page
            newPage = newPage + 1;
            this.setState({page:newPage});
            this.getMovies(this.state.selectedGenre, newPage);
        }
    }
    //gets the dates
    checkDates() {
        var d = new Date();
        let endDate = d.getFullYear()+'-'+((Number(d.getMonth()) + 1) < 10 ? + '0' : '') + (Number(d.getMonth()) + 1)+'-'+d.getDate();
        this.state.end = endDate;
        console.log(this.state.end);

        d.setDate(d.getDate() - 60);
        let startDate = d.getFullYear()+'-'+((Number(d.getMonth()) + 1) < 10 ? + '0' : '') + (Number(d.getMonth()) + 1)+'-'+d.getDate();
        this.state.start = startDate;
        console.log(this.state.start);
   }

    getMovies(selectedGenre, page) {    
        this.checkDates();
        const BASE_URL  = 'http://api.themoviedb.org/3/discover/movie?api_key='
                + API_KEY
+ '&primary_release_date.gte='+this.state.start+'&primary_release_date.lte='+this.state.end+
                '&page='+page+'&with_genres='+selectedGenre;

        const URL        = BASE_URL;

        // Request and wait for data from remote server.
        fetch(URL).then(response => response.json())
            // Data retrieved so parse it.
            .then((data) => {
                this.setState({movies:data.results});
                this.setState({total_pages: data.total_pages});
                console.log(JSON.stringify(data.results));
            })
            // Data is not retieved.
            .catch((error) => {
                alert(error);
            });         
    }

    getGenres() {
        // This code gets data from the remote server.
        fetch(GENRES).then(response => response.json())

        // Data is retrieved.
        .then((data) => {
            this.setState({genres:data.genres});
            console.log(JSON.stringify(data.genres));
        })
        // Data is not retrieved.
        .catch((error) => {
            alert(error);
        });
        
    }

    render() {
        return (          
            <div className = 'wrapper'>
                {/* Genres */}
                <nav>

                <select type='text' value={this.state.selectedGenre} onChange={this.handleGenreChange}>
                    {this.state.genres.map((item, index)=>(
                    <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <div className="pages">
                <button onClick={this.changePagePrev}> Prev </button>
                 Page {this.state.page} of {this.state.total_pages} 
                <button onClick={this.changePageNext}> Next </button>
                </div>
                </nav>
                <div className = 'movie-wrapper'>
                
                {this.state.movies.map((item, index)=>(
                    <div className ='movie'key={item.id}>
                        <img src = {IMG_URL + item.poster_path} alt= {'Poster for ' + item.title}></img>
                        {/*index} {item.id*/} 
                        <h2>{item.title}</h2> <p>{item.overview}</p> 
              
                    </div>
                ))}

                </div>         
            </div>     
        )
    }
}
export default App;
