package io.github.cemalunal.backend.model;

public class Customer {

    private String id;
    private String name;

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }
    /**
     * @return the id
     */
    public String getId() {
        return id;
    }
    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }
    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

}
