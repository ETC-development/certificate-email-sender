#!/bin/bash


template=""
name=""
size="100"
x="0"
y="0"

folder="results"


while getopts ':t:n:s:x:y:' OPTION; do

  case "$OPTION" in
    t)
      template="$OPTARG"
      if [[ ! (-f "$template") ]]; then
        echo "Error: $template doesn't exist."
        exit 1;
      fi

      ;;


    n)
      name="$OPTARG"
      ;;

    s)
      size="$OPTARG"
      re='^[0-9]+$'
      if ! [[ $size =~ $re ]] ; then
      echo "Error: size has to be a number" >&2; exit 1
      fi
      ;;

    x)
      x="$OPTARG"
      re='^[0-9]+$'
      if ! [[ $x =~ $re ]] ; then
      echo "Error: x offset has to be a number" >&2; exit 1
      fi
      ;;

    y)
      y="$OPTARG"
      re='^[0-9]+$'
      if ! [[ $y =~ $re ]] ; then
      echo "Error: y offset has to be a number" >&2; exit 1
      fi
      ;;

    ?)
      echo "Usage: $(basename $0) [-t template-image.png] [-n name] [-s font-size = 100] [-x horizontal offset from the center = 0] [-y vertical offset from the center = 0]"
      exit 1
      ;;
  esac

done


if [[ ! (-n "$name") ]]; then
    echo "Error: you need to provide the name (-n <name>) option"
    exit 1
fi

if [[ ! (-n "$template") ]]; then
    echo "Error: you need to provide the template image (-t <template>) option"
fi


mkdir -p $folder

convert -pointsize $size -font "Montserrat" -stroke black -gravity center -fill black -draw "fill black text $x,$y'$name'" ${template} "${folder}/certificate_${name}.png"