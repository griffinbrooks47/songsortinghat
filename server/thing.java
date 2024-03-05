System.out.println("next");

        forall(1, this.xLength, 1, this.yLength, (xIdx, yIdx) -> {

            System.out.println(xIdx + "-" + yIdx);

            // Grabs the current iteration sequence chars
            char xChar = x.charAt(xIdx-1);
            char yChar = y.charAt(yIdx-1);

            // Diagonal Score = S[i - 1, j - 1] + M (Xi, Yi)
            HjDataDrivenFuture<Integer> diagDDF = scoresMatrix.get(xIdx - 1).get(yIdx - 1);
            // Top Column Score = S[i - 1, j] + M (Xi, - )
            HjDataDrivenFuture<Integer> topColDDF = scoresMatrix.get(xIdx - 1).get(yIdx);
            // Left Row Score = S[i, j - 1] + M ( - , Yi)
            HjDataDrivenFuture<Integer> leftRowDDF = scoresMatrix.get(xIdx).get(yIdx - 1);

            // Await the required matrix values, then compute the current matrix value.
            asyncAwait(diagDDF, topColDDF, leftRowDDF, () -> {

                // Safely get await clause values.
                int diagScore = diagDDF.safeGet() + getScore(charMap(xChar), charMap(yChar));
                int topColScore = topColDDF.safeGet() + getScore(charMap(xChar), 0);
                int leftRowScore = leftRowDDF.safeGet() + getScore(0, charMap(yChar));

                doWork(1);

                scoresMatrix.get(xIdx).get(yIdx).put(
                        Math.max(
                                diagScore,
                                Math.max(
                                        topColScore,
                                        leftRowScore
                                )
                        )
                );

            });

        });

        return scoresMatrix.get(xLength).get(yLength).safeGet();




// next


 // TODO: implement this!

        this.xLength = xLength;
        this.yLength = yLength;

        // 2d Array of ddfs.
        this.scoresMatrix = new ArrayList<>();

        // Initialized the 2D scores matrix field.
        for(int i = 0; i < xLength + 1; i++){
            List<HjDataDrivenFuture<Integer>> row = new ArrayList<>();
            for(int j = 0; j < yLength + 1; j++){
                row.add(newDataDrivenFuture());
            }
            this.scoresMatrix.add(row);
        }

        for(int ii = 1; ii < xLength; ii++){
            scoresMatrix.get(ii).get(0).put(ii * getScore(1, 0));
        }

        for(int jj = 1; jj < yLength + 1; jj++){
            scoresMatrix.get(0).get(jj).put(jj * getScore(0, 1));
        }

        // Initialize first value in matrix.
        scoresMatrix.get(0).get(0).put(0);

        System.out.println("First");