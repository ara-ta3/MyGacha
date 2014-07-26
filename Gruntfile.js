module.exports = function(grunt){
    grunt.initConfig({
        watch:{
            options:{
                livereload:true
            },
            files:'*',
            tasks:[]
        },
        connect:{
            server:{
                options:{
                    port:8080,
                    hostname:'127.0.0.1'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['connect', 'watch']);

};
