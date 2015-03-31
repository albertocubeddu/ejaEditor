#!/bin/bash
PS3='Please enter your choice: I want to install: '
options=("As Library" "As File" "Quit")

select opt in "${options[@]}"
do
    case $opt in
        "As Library")
            	echo "The library will be copied in the eja lib and you can call it with a .edit in the directory or after the extension of the file"
            	cp ejaEditorLib.eja /opt/eja.it/lib/.  
                break;
		;;
        "As File")
            	echo "The file will be copied in the current parent directory. You have to call it to execute it."
            	cd ..
                cp ejaEditor/ejaEditorLib.eja .
                break;
		;;
        "Quit")
            break;
            ;;
        *) echo invalid option;;
    esac
done
