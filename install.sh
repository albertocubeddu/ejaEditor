#!/bin/bash
PS3='Please enter your choice: I want to install: '
options=("As Library" "Install file Locally" "Quit")

select opt in "${options[@]}"
do
    case $opt in
        "As Library")
            	echo "\nThe library will be copied in the eja lib and you can call it with a .edit in the directory or after the extension of the file\n"
            	cp ejaEditorLib.eja /opt/eja.it/lib/.  
                break;
		;;
        "Install file Locally")
                echo "\nThe file will be placed in this directory\n"
                mkdir js
                cd js
                wget http://code.jquery.com/jquery-1.11.2.min.js
                wget estoporaquello.com/ejaEditor/ace.tar.gz
                tar -xvf ace.tar.gz 
                rm ace.tar.gz
        break;
        ;;
        "Quit")
            break;
            ;;
        *) echo invalid option;;
    esac
done
